import React, { useState } from 'react';
import {
  Heart,
  Download,
  Star,
  Eye,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Share2,
} from 'lucide-react';

interface TemplateCardProps {
  template: any;
  onView?: (templateId: string) => void;
  onDownload?: (templateId: string) => void;
  onFavorite?: (templateId: string) => void;
  onClone?: (templateId: string) => void;
  onEdit?: (templateId: string) => void;
  onDelete?: (templateId: string) => void;
  isOwner?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onView,
  onDownload,
  onFavorite,
  onClone,
  onEdit,
  onDelete,
  isOwner = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isFavorited, setIsFavorited] = useState(template.isFavorited || false);

  const handleFavorite = async () => {
    setIsFavorited(!isFavorited);
    onFavorite?.(template._id);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'admin-dashboard': 'bg-blue-100 text-blue-700',
      ecommerce: 'bg-green-100 text-green-700',
      crm: 'bg-purple-100 text-purple-700',
      erp: 'bg-orange-100 text-orange-700',
      portfolio: 'bg-pink-100 text-pink-700',
      blog: 'bg-indigo-100 text-indigo-700',
      lms: 'bg-yellow-100 text-yellow-700',
      hrms: 'bg-red-100 text-red-700',
      dms: 'bg-teal-100 text-teal-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const renderTechStack = () => {
    const stack = template.supportedStack;
    const techs = [
      stack.frontend?.[0],
      stack.backend?.[0],
      stack.database?.[0],
    ].filter(Boolean);

    return (
      <div className="flex flex-wrap gap-1">
        {techs.map((tech: string, idx: number) => (
          <span
            key={idx}
            className="inline-block px-2 py-1 text-xs rounded bg-gray-200 text-gray-700"
          >
            {tech}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
      {/* Preview Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden group cursor-pointer">
        {template.preview?.image ? (
          <img
            src={template.preview.image}
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            onClick={() => onView?.(template._id)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Eye className="w-8 h-8" />
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-2 right-2 flex gap-2">
          {template.isFeatured && (
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-colors flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onDownload?.(template._id)}
            className="bg-white text-gray-900 p-3 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => onView?.(template._id)}
            className="bg-white text-gray-900 p-3 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            title="View"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${getCategoryColor(
              template.category
            )}`}
          >
            {template.categoryName || template.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">
              {template.rating?.average?.toFixed(1) || '0'}
            </span>
            <span className="text-xs text-gray-500">({template.rating?.count || 0})</span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600"
          onClick={() => onView?.(template._id)}
        >
          {template.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

        {/* Tech Stack */}
        <div className="mb-3">{renderTechStack()}</div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {template.downloads || 0}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {template.views || 0}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-gray-200">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              isFavorited ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          {isOwner ? (
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => onClone?.(template._id)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                <Copy className="w-4 h-4" />
                Clone
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <button
                      onClick={() => {
                        onEdit?.(template._id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(template._id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => onDownload?.(template._id)}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-1"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
