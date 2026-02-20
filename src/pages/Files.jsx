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
    if (user) fetchFiles();
  }, [user]);

  const fetchFiles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setFiles(data || []);
    setLoading(false);
  };

  const handleFileUpload = async (e, category) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);

    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('medical-files')
      .upload(filePath, file);

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('medical-files')
      .getPublicUrl(filePath);

    await supabase.from('file_uploads').insert([
      {
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: data.publicUrl,
        category,
      },
    ]);

    fetchFiles();
    setUploading(false);
  };

  const filteredFiles =
    selectedCategory === 'all'
      ? files
      : files.filter((f) => f.category === selectedCategory);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Medical Files</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        filteredFiles.map((file) => (
          <div key={file.id} className="border p-4 rounded mb-2">
            <p>{file.file_name}</p>
            <a href={file.file_url} target="_blank" rel="noreferrer">
              <Download />
            </a>
            <button onClick={() => supabase.from('file_uploads').delete().eq('id', file.id)}>
              <Trash2 />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
