import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDialogueLines, createDialogueLine, deleteDialogueLine, getLessons } from '@/lib/api';
import { dialogueLineSchema, type DialogueLineFormData } from '@/lib/schemas';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { FileUpload } from '@/components/FileUpload';

export default function DialogueLines() {
  const queryClient = useQueryClient();
  const { data: dialogueLines, isLoading } = useQuery({ queryKey: ['dialogue-lines'], queryFn: getDialogueLines });
  const { data: lessons } = useQuery({ queryKey: ['lessons'], queryFn: getLessons });
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(dialogueLineSchema),
  });
  const [selectedLessonId, setSelectedLessonId] = useState<number | 'all'>('all');

  const createMutation = useMutation({
    mutationFn: createDialogueLine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dialogue-lines'] });
      toast.success('Dialogue line created successfully');
      reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to create dialogue line');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDialogueLine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dialogue-lines'] });
      toast.success('Dialogue line deleted successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete dialogue line');
    },
  });

  const onSubmit: SubmitHandler<DialogueLineFormData> = (data) => {
    createMutation.mutate(data);
  };

  const filteredDialogueLines = selectedLessonId === 'all'
    ? dialogueLines
    : dialogueLines?.filter(line => line.lessonId === Number(selectedLessonId));

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dialogue Lines</h1>
        <Link to="/" className="text-blue-500 hover:underline">Back to Dashboard</Link>
      </div>

      <div className="mb-6">
        <label className="mr-2 font-medium">Filter by Lesson:</label>
        <select
          className="p-2 border rounded"
          value={selectedLessonId}
          onChange={(e) => setSelectedLessonId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          <option value="all">All Lessons</option>
          {lessons?.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Existing Dialogue Lines</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredDialogueLines?.map((line) => (
              <div key={line.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <h3 className="font-bold">{line.roleName}: {line.contentHanzi}</h3>
                  <p className="text-gray-500 text-sm">{line.contentPinyin}</p>
                  <p className="text-gray-500 text-sm">{line.meaningVn}</p>
                  <p className="text-xs text-gray-400 mt-1">Lesson: {line.lesson?.title}</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this dialogue line?')) {
                      deleteMutation.mutate(line.id);
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
          <h2 className="text-xl font-semibold mb-4">Add New Dialogue Line</h2>
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
            <div>
              <label className="block text-sm font-medium mb-1">Role Name</label>
              <input
                {...register('roleName')}
                className="w-full p-2 border rounded"
                placeholder="e.g. A, B, Teacher"
              />
              {errors.roleName && <p className="text-red-500 text-sm mt-1">{errors.roleName.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hanzi</label>
                <input
                  {...register('contentHanzi')}
                  className="w-full p-2 border rounded"
                  placeholder="你好"
                />
                {errors.contentHanzi && <p className="text-red-500 text-sm mt-1">{errors.contentHanzi.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pinyin</label>
                <input
                  {...register('contentPinyin')}
                  className="w-full p-2 border rounded"
                  placeholder="nǐ hǎo"
                />
                {errors.contentPinyin && <p className="text-red-500 text-sm mt-1">{errors.contentPinyin.message}</p>}
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
            <Controller
              control={control}
              name="avatarUrl"
              render={({ field }) => (
                <FileUpload
                  label="Role Avatar"
                  accept="image/*"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="audioUrl"
              render={({ field }) => (
                <FileUpload
                  label="Audio Line"
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
              {createMutation.isPending ? 'Creating...' : 'Create Dialogue Line'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
