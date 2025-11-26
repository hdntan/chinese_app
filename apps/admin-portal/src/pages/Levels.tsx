import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getLevels, createLevel, deleteLevel, type HskLevel } from '@/lib/api';
import { Link } from 'react-router-dom';

export default function Levels() {
  const queryClient = useQueryClient();
  const { data: levels, isLoading } = useQuery({ queryKey: ['levels'], queryFn: getLevels });
  const { register, handleSubmit, reset } = useForm<Omit<HskLevel, 'id'>>();

  const createMutation = useMutation({
    mutationFn: createLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
    },
  });

  const onSubmit = (data: Omit<HskLevel, 'id'>) => {
    createMutation.mutate({ ...data, level: Number(data.level) });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">HSK Levels</h1>
        <Link to="/" className="text-blue-500 hover:underline">Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Existing Levels</h2>
          <div className="space-y-4">
            {levels?.map((level) => (
              <div key={level.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-bold">HSK {level.level} - {level.name}</h3>
                  <p className="text-gray-500 text-sm">{level.description}</p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(level.id)}
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
          <h2 className="text-xl font-semibold mb-4">Add New Level</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Level Number</label>
              <input
                type="number"
                {...register('level', { required: true })}
                className="w-full p-2 border rounded"
                placeholder="e.g. 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                {...register('name', { required: true })}
                className="w-full p-2 border rounded"
                placeholder="e.g. Beginner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...register('description')}
                className="w-full p-2 border rounded"
                placeholder="Optional description"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Level'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
