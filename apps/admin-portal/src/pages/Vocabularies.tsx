import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getVocabularies, createVocabulary, deleteVocabulary, getLessons, type Vocabulary } from '@/lib/api';
import { Link } from 'react-router-dom';

export default function Vocabularies() {
  const queryClient = useQueryClient();
  const { data: vocabularies, isLoading } = useQuery({ queryKey: ['vocabularies'], queryFn: getVocabularies });
  const { data: lessons } = useQuery({ queryKey: ['lessons'], queryFn: getLessons });
  const { register, handleSubmit, reset } = useForm<Omit<Vocabulary, 'id' | 'lesson'>>();

  const createMutation = useMutation({
    mutationFn: createVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabularies'] });
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabularies'] });
    },
  });

  const onSubmit = (data: Omit<Vocabulary, 'id' | 'lesson'>) => {
    createMutation.mutate({
      ...data,
      lessonId: Number(data.lessonId),
    });
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
                  onClick={() => deleteMutation.mutate(vocab.id)}
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
              <select {...register('lessonId', { required: true })} className="w-full p-2 border rounded">
                <option value="">Select Lesson</option>
                {lessons?.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hanzi</label>
                <input
                  {...register('hanzi', { required: true })}
                  className="w-full p-2 border rounded"
                  placeholder="你好"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pinyin</label>
                <input
                  {...register('pinyin', { required: true })}
                  className="w-full p-2 border rounded"
                  placeholder="nǐ hǎo"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meaning (VN)</label>
              <input
                {...register('meaningVn', { required: true })}
                className="w-full p-2 border rounded"
                placeholder="Xin chào"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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
