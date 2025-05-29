// src/app/page.tsx

"use client";
import React, { useState, useRef, useEffect } from 'react';
import Map from '@/components/Map';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SatelliteImage } from '@/lib/types';

export default function Home() {
  const [geojson, setGeojson] = useState<any>(null);
  const [images, setImages] = useState<SatelliteImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<SatelliteImage | null>(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<any>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/geo+json': ['.geojson'],
      'application/json': ['.json']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          
          let geometry = json;
          if (json.type === 'FeatureCollection' && json.features?.length > 0) {
            geometry = json.features[0].geometry;
          }
          
          if (!['Polygon', 'MultiPolygon'].includes(geometry.type)) {
            toast.error('Only Polygon or MultiPolygon GeoJSON supported');
            return;
          }
          
          setGeojson(geometry);
          toast.success('GeoJSON loaded successfully!');
        } catch (error) {
          toast.error('Invalid GeoJSON file');
        }
      };
      
      reader.readAsText(file);
    }
  });

    const searchImages = async () => {
    if (!geojson) {
      toast.warn('Please upload a GeoJSON file first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/images/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geojson)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }
      
      setImages(data);
      toast.info(`Found ${data.length} images`);
    } catch (error: any) {
      toast.error(error.message || 'Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#840032]">
        <span className="text-[#002642]">Orbital</span> Edge Imaging
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <Map 
              ref={mapRef} 
              geojson={geojson} 
              onFeatureSelect={f => setSelectedImage(f)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div {...getRootProps({ className: 'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer' })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop GeoJSON file here, or click to select</p>
              <em className="text-sm text-gray-500">(Only *.geojson files will be accepted)</em>
            </div>

            <div className="mt-4 flex justify-between">
              <button 
                onClick={searchImages}
                disabled={loading || !geojson}
                className="bg-[#840032] text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : 'Search Images'}
              </button>
              
              <button 
                onClick={() => {
                  setGeojson(null);
                  setImages([]);
                  setSelectedImage(null);
                  mapRef.current?.clearFeatures();
                }}
                className="border border-gray-300 px-4 py-2 rounded"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {selectedImage ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-2">Image Details</h2>
              <button 
                className="text-sm text-gray-500 mb-2"
                onClick={() => setSelectedImage(null)}
              >
                ← Back to list
              </button>
              
              <div className="space-y-2">
                <p><strong>Catalog ID:</strong> {selectedImage.catalogID}</p>
                <p><strong>Resolution:</strong> {selectedImage.resolution}m</p>
                <p><strong>Cloud Coverage:</strong> {selectedImage.cloudCoverage}%</p>
                <p><strong>Sensor:</strong> {selectedImage.sensor}</p>
                <p><strong>Date:</strong> {new Date(selectedImage.acquisitionDateStart).toLocaleDateString()}</p>
              </div>
              
              <button 
                className="mt-4 w-full bg-[#002642] text-white py-2 rounded"
                  onClick={async () => {
                    try {
                      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ catalogId: selectedImage.catalogID })
                      });
                      
                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Order failed');
                      }
                      
                      toast.success('Order placed successfully!');
                    } catch (error: any) {
                      toast.error(error.message || 'Order failed');
                    }
                  }}
              >
                Order Image
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">Search Results ({images.length})</h2>
              
              {images.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {geojson 
                    ? 'No images found. Try different area.' 
                    : 'Upload GeoJSON to search for satellite images'}
                </p>
              ) : (
                <ul className="space-y-2 max-h-[500px] overflow-y-auto">
                  {images.map(image => (
                    <li 
                      key={image.catalogID} 
                      className="border-b border-gray-200 pb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="font-medium">{image.catalogID}</div>
                      <div className="text-sm">
                        {new Date(image.acquisitionDateStart).toLocaleDateString()} | 
                        {image.resolution}m | 
                        {image.cloudCoverage}% clouds
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">My Orders</h2>
            <OrderList />
          </div>
        </div>
      </div>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}

const OrderList = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p className="text-gray-500">No orders yet</p>;

  return (
    <ul className="space-y-2">
      {orders.map(order => (
        <li key={order.id} className="border-b border-gray-200 pb-2">
          <div className="font-medium">Order #{order.id}</div>
          <div className="text-sm">
            {new Date(order.order_date).toLocaleDateString()} | 
            Image: {order.image_id}
          </div>
        </li>
      ))}
    </ul>
  );
};
