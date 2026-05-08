import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download,
  Heart,
  Share2,
  Copy,
  Star,
  Eye,
  ArrowLeft,
  Loader,
  AlertCircle,
  CheckCircle2,
  Code2,
  Package,
  Zap,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import TemplateService from '@/services/templateService';

export const TemplateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [template, setTemplate] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [compatibility, setCompatibility] = useState<any>(null);

  useEffect(() => {
    loadTemplateDetails();
  }, [id]);

  const loadTemplateDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [templateData, versionsData] = await Promise.all([
        TemplateService.getTemplateById(id!),
        TemplateService.getTemplateVersions(id!),
      ]);

      setTemplate(templateData.template);
      setVersions(versionsData.versions || []);
      setIsFavorited(templateData.template?.isFavorited || false);
    } catch (err: any) {
      setError(err.message || 'Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await TemplateService.downloadTemplate(id!);
      // Could show success toast
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const handleFavorite = async () => {
    try {
      await TemplateService.toggleFavorite(id!);
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleClone = async () => {
    try {
      const cloned = await TemplateService.cloneTemplate(id!);
      navigate(`/templates/${cloned.template._id}/edit`);
    } catch (err) {
      console.error('Failed to clone:', err);
    }
  };

  const handleSubmitRating = async () => {
    if (!userRating) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmittingRating(true);
      await TemplateService.rateTemplate(id!, userRating, userComment);
      setShowRatingForm(false);
      setUserRating(0);
      setUserComment('');
      loadTemplateDetails();
    } catch (err) {
      console.error('Failed to submit rating:', err);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </button>
          <p className="text-gray-600">Template not found</p>
        </div>
      </div>
    );
  }

  const gallery = template.preview?.gallery || [template.preview?.image];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
              <p className="text-gray-600 mt-2">{template.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFavorite}
                className={`p-3 rounded-lg transition-colors ${
                  isFavorited
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300">
                {gallery[selectedImageIndex] ? (
                  <img
                    src={gallery[selectedImageIndex]}
                    alt="Template preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Eye className="w-12 h-12" />
                  </div>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {gallery.map((image: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === idx
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt="Gallery thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tech Stack */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Technology Stack
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {template.supportedStack.frontend.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Frontend</p>
                    <div className="flex flex-wrap gap-2">
                      {template.supportedStack.frontend.map((tech: string) => (
                        <span
                          key={tech}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {template.supportedStack.backend.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Backend</p>
                    <div className="flex flex-wrap gap-2">
                      {template.supportedStack.backend.map((tech: string) => (
                        <span
                          key={tech}
                          className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {template.supportedStack.database.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Database</p>
                    <div className="flex flex-wrap gap-2">
                      {template.supportedStack.database.map((tech: string) => (
                        <span
                          key={tech}
                          className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {template.supportedStack.authentication.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Auth</p>
                    <div className="flex flex-wrap gap-2">
                      {template.supportedStack.authentication.map((tech: string) => (
                        <span
                          key={tech}
                          className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Components */}
            {template.components?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Components ({template.components.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {template.components.map((component: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{component.name}</p>
                        {component.description && (
                          <p className="text-sm text-gray-600">{component.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings and Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>

              {/* Rating Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-4xl font-bold text-gray-900">
                      {template.rating?.average?.toFixed(1) || '0'}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= Math.round(template.rating?.average || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Based on {template.rating?.count || 0} ratings
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Rating */}
              {!showRatingForm ? (
                <button
                  onClick={() => setShowRatingForm(true)}
                  className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  Rate this Template
                </button>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          onClick={() => setUserRating(i)}
                          className="transition-colors"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              i <= userRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitRating}
                      disabled={submittingRating}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submittingRating ? 'Submitting...' : 'Submit Rating'}
                    </button>
                    <button
                      onClick={() => setShowRatingForm(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Info</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">{template.categoryName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Version</p>
                  <p className="font-medium text-gray-900">{template.version}</p>
                </div>
                <div>
                  <p className="text-gray-600">Downloads</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {template.downloads || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Views</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {template.views || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-5 h-5" />
                Download Template
              </button>
              <button
                onClick={handleClone}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                <Copy className="w-5 h-5" />
                Clone Template
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Tags */}
            {template.tags?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TemplateDetailsPage;
