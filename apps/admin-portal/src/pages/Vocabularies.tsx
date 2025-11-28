import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getVocabularies, createVocabulary, deleteVocabulary, getLessons } from '@/lib/api';
import { vocabularySchema, type VocabularyFormData } from '@/lib/schemas';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { FileUpload } from '@/components/FileUpload';

export default function Vocabularies() {
  const queryClient = useQueryClient();
  const { data: vocabularies, isLoading } = useQuery({ queryKey: ['vocabularies'], queryFn: getVocabularies });
  const { data: lessons } = useQuery({ queryKey: ['lessons'], queryFn: getLessons });
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(vocabularySchema),
  });

  const createMutation = useMutation({
    mutationFn: createVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabularies'] });
      toast.success('Vocabulary created successfully');
      reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to create vocabulary');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabularies'] });
      toast.success('Vocabulary deleted successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete vocabulary');
    },
  });

  const onSubmit: SubmitHandler<VocabularyFormData> = (data) => {
    createMutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vocabularies</h1>
        <Link to="/" className="text-blue-500 hover:underline">Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Existing Vocabularies</h2>
          <div className="space-y-4">
            {vocabularies?.map((vocab) => (
              <div key={vocab.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-bold">{vocab.hanzi} ({vocab.pinyin})</h3>
                  <p className="text-gray-500 text-sm">{vocab.meaningVn}</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this vocabulary?')) {
                      deleteMutation.mutate(vocab.id);
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
          <h2 className="text-xl font-semibold mb-4">Add New Vocabulary</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Lesson</label>
              <select {...register('lessonId')} className="w-full p-2 border rounded">
                <option value="">Select Lesson</option>
                {lessons?.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))}
              </select>
              {errors.lessonId && <p className="text-red-500 text-sm mt-1">{errors.lessonId.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hanzi</label>
                <input
                  {...register('hanzi')}
                  className="w-full p-2 border rounded"
                  placeholder="你好"
                />
                {errors.hanzi && <p className="text-red-500 text-sm mt-1">{errors.hanzi.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pinyin</label>
                <input
                  {...register('pinyin')}
                  className="w-full p-2 border rounded"
                  placeholder="nǐ hǎo"
                />
                {errors.pinyin && <p className="text-red-500 text-sm mt-1">{errors.pinyin.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meaning (VN)</label>
              <input
                {...register('meaningVn')}
                className="w-full p-2 border rounded"
                placeholder="Xin chào"
              />
              {errors.meaningVn && <p className="text-red-500 text-sm mt-1">{errors.meaningVn.message}</p>}
            </div>
            <Controller
              control={control}
              name="audioUrl"
              render={({ field }) => (
                <FileUpload
                  label="Audio Pronunciation"
                  accept="audio/*"
                  type="audio"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Vocabulary'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
