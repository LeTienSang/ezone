import React from 'react';
import { Button } from '../common/Button';
import { BookOpen, Users, Clock } from 'lucide-react';

interface CourseCardProps {
  title: string;
  image: string;
  instructor: string;
  price: string;
  duration: string;
  students: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ title, image, instructor, price, duration, students }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group">
      <div className="relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-primary">Hot</div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-2 hover:text-primary cursor-pointer">{title}</h3>
        <p className="text-sm text-text-body mb-4">Giảng viên: <span className="font-medium text-text-main">{instructor}</span></p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{students} học viên</span>
          </div>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xl font-bold text-primary">{price}</span>
          <Button variant="outline" className="text-sm px-3 py-1">Chi tiết</Button>
        </div>
      </div>
    </div>
  );
};
