import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLessons, createLesson, deleteLesson, getLevels } from '@/lib/api';
import { lessonSchema, type LessonFormData } from '@/lib/schemas';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function Lessons() {
  const queryClient = useQueryClient();
  const { data: lessons, isLoading } = useQuery({ queryKey: ['lessons'], queryFn: getLessons });
  const { data: levels } = useQuery({ queryKey: ['levels'], queryFn: getLevels });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(lessonSchema),
  });

  const createMutation = useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson created successfully');
      reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to create lesson');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson deleted successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete lesson');
    },
  });

  const onSubmit: SubmitHandler<LessonFormData> = (data) => {
    createMutation.mutate({
      ...data,
      type: 'VOCABULARY',
      status: 'PUBLISHED',
      isFree: true,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lessons</h1>
        <Link to="/" className="text-blue-500 hover:underline">Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Existing Lessons</h2>
          <div className="space-y-4">
            {lessons?.map((lesson) => (
              <div key={lesson.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-bold">{lesson.title}</h3>
                  <p className="text-gray-500 text-sm">Level: HSK {lesson.level?.level}</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this lesson?')) {
                      deleteMutation.mutate(lesson.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Create Form */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Add New Lesson</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select {...register('levelId')} className="w-full p-2 border rounded">
                <option value="">Select Level</option>
                {levels?.map((level) => (
                  <option key={level.id} value={level.id}>HSK {level.level}</option>
                ))}
              </select>
              {errors.levelId && <p className="text-red-500 text-sm mt-1">{errors.levelId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                {...register('title')}
                className="w-full p-2 border rounded"
                placeholder="Lesson Title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order Index</label>
              <input
                type="number"
                {...register('orderIndex')}
                className="w-full p-2 border rounded"
                placeholder="1"
              />
              {errors.orderIndex && <p className="text-red-500 text-sm mt-1">{errors.orderIndex.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Lesson'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
