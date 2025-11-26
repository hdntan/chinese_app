import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLevels, createLevel, deleteLevel } from '@/lib/api';
import { levelSchema, type LevelFormData } from '@/lib/schemas';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function Levels() {
  const queryClient = useQueryClient();
  const { data: levels, isLoading } = useQuery({ queryKey: ['levels'], queryFn: getLevels });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      level: undefined,
      name: '',
      description: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      toast.success('Level created successfully');
      reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to create level');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      toast.success('Level deleted successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete level');
    },
  });

  const onSubmit: SubmitHandler<LevelFormData> = (data) => {
    createMutation.mutate(data);
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
                  <h3 className="font-bold">Level {level.level}: {level.name}</h3>
                  <p className="text-gray-500 text-sm">{level.description}</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this level?')) {
                      deleteMutation.mutate(level.id);
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
          <h2 className="text-xl font-semibold mb-4">Add New Level</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Level Number</label>
              <input
                type="number"
                min="1"
                max="6"
                {...register('level')}
                className="w-full p-2 border rounded"
                placeholder="e.g. 1"
              />
              {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                {...register('name')}
                className="w-full p-2 border rounded"
                placeholder="e.g. Beginner"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...register('description')}
                className="w-full p-2 border rounded"
                placeholder="Optional description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
