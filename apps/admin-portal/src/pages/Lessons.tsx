import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getLessons, createLesson, deleteLesson, getLevels, type Lesson } from '@/lib/api';
import { Link } from 'react-router-dom';

export default function Lessons() {
  const queryClient = useQueryClient();
  const { data: lessons, isLoading } = useQuery({ queryKey: ['lessons'], queryFn: getLessons });
  const { data: levels } = useQuery({ queryKey: ['levels'], queryFn: getLevels });
  const { register, handleSubmit, reset } = useForm<Omit<Lesson, 'id' | 'level'>>();

  const createMutation = useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });

  const onSubmit = (data: Omit<Lesson, 'id' | 'level'>) => {
    createMutation.mutate({
      ...data,
      levelId: Number(data.levelId),
      orderIndex: Number(data.orderIndex),
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
                  onClick={() => deleteMutation.mutate(lesson.id)}
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
              <select {...register('levelId', { required: true })} className="w-full p-2 border rounded">
                <option value="">Select Level</option>
                {levels?.map((level) => (
                  <option key={level.id} value={level.id}>HSK {level.level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                {...register('title', { required: true })}
                className="w-full p-2 border rounded"
                placeholder="Lesson Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order Index</label>
              <input
                type="number"
                {...register('orderIndex', { required: true })}
                className="w-full p-2 border rounded"
                placeholder="1"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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
