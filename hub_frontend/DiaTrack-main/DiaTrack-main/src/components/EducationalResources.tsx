import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';
import { Input } from './ui/input';
import { getEducationalResources, EducationalResource } from '../api/education';

interface EducationalResourcesProps {
  onClose: () => void;
}

export function EducationalResources({ onClose }: EducationalResourcesProps) {
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<EducationalResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const data = await getEducationalResources();
        setResources(data);
        setFilteredResources(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load educational resources');
        console.error('Error fetching educational resources:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory, resources]);

  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

  return (
    <div className="h-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col pt-11">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 border-b">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Educational Resources</h1>
            <p className="text-sm text-gray-500">Learn about diabetes management</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-3 bg-white border-b overflow-x-auto">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'hover:bg-green-50'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resources...</p>
          </div>
        ) : error ? (
          <Card className="shadow-lg border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : filteredResources.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No resources found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 max-w-[375px] mx-auto">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="shadow-lg border-2 border-green-200 hover:border-green-400 transition-colors">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <span>{resource.title}</span>
                    </CardTitle>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {resource.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{resource.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
