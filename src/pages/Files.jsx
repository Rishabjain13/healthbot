import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import { Upload, FileText, Download, Trash2, File, Image, FileSpreadsheet } from 'lucide-react';

export default function Files() {
  const user = useSelector((state) => state.auth.user);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const fetchFiles = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setFiles(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e, category) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('medical-files')
      .upload(fileName, file);

    if (uploadError) {
      alert('Error uploading file: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('medical-files')
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    const { error: dbError } = await supabase.from('file_uploads').insert([
      {
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: publicUrl,
        category: category,
      },
    ]);

    if (dbError) {
      alert('Error saving file info: ' + dbError.message);
    } else {
      fetchFiles();
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (file) => {
    if (!confirm(`Are you sure you want to delete ${file.file_name}?`)) return;

    await supabase.from('file_uploads').delete().eq('id', file.id);
    fetchFiles();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return FileSpreadsheet;
    return File;
  };

  const categories = [
    { value: 'all', label: 'All Files' },
    { value: 'medical_record', label: 'Medical Records' },
    { value: 'lab_result', label: 'Lab Results' },
    { value: 'prescription', label: 'Prescriptions' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'other', label: 'Other' },
  ];

  const filteredFiles =
    selectedCategory === 'all'
      ? files
      : files.filter((f) => f.category === selectedCategory);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Files</h1>
            <p className="text-gray-600 mt-1">Upload and manage your medical documents</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {categories.slice(1).map((cat) => (
            <label
              key={cat.value}
              className="relative bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer group"
            >
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, cat.value)}
                className="hidden"
                disabled={uploading}
              />
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{cat.label}</p>
                <p className="text-xs text-gray-500 mt-1">Click to upload</p>
              </div>
            </label>
          ))}
        </div>

        {uploading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
            Uploading file...
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-1 p-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading files...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No files yet</h3>
                <p className="text-gray-600">Upload your first medical file to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.file_type);
                  return (
                    <div
                      key={file.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FileIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex space-x-1">
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(file)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3
                        className="font-semibold text-gray-900 text-sm mb-1 truncate"
                        title={file.file_name}
                      >
                        {file.file_name}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span className="px-2 py-1 bg-white rounded border border-gray-200">
                          {file.category.replace('_', ' ')}
                        </span>
                        <span>{formatFileSize(file.file_size)}</span>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
