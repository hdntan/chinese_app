import { Link } from 'react-router-dom';
import { BookOpen, Layers, MessageSquare, GraduationCap, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const cards = [
    {
      title: 'HSK Levels',
      description: 'Manage HSK levels and descriptions',
      href: '/levels',
      icon: Layers,
      color: 'bg-blue-500',
    },
    {
      title: 'Lessons',
      description: 'Create and organize lessons',
      href: '/lessons',
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      title: 'Vocabularies',
      description: 'Manage vocabulary words',
      href: '/vocabularies',
      icon: GraduationCap,
      color: 'bg-purple-500',
    },
    {
      title: 'Dialogue Lines',
      description: 'Manage conversation dialogues',
      href: '/dialogue-lines',
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Admin</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your content today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              to={card.href}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-white mb-4 shadow-sm`}>
                <Icon size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {card.title}
              </h2>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {card.description}
              </p>
              <div className="flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Manage <ArrowRight size={16} className="ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
