import React, { useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  onComplete?: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, title, onComplete }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const bookRef = useRef<any>(null);

  // Simulate PDF loading
  React.useEffect(() => {
    setIsLoading(true);
    
    // In a real implementation, we would load the PDF here
    // For now, we'll simulate loading with a timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
      setNumPages(10); // Simulate 10 pages
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [pdfUrl]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handlePageChange = (e: any) => {
    setCurrentPage(e.data + 1);
    
    // If we're on the last page, mark as complete
    if (e.data + 1 === numPages && onComplete) {
      onComplete();
    }
  };

  const nextPage = () => {
    if (bookRef.current && currentPage < numPages) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current && currentPage > 1) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-red-600">Failed to load PDF: {error}</p>
      </div>
    );
  }

  // Generate page components
  const pages = Array.from({ length: numPages }, (_, i) => (
    <div key={i} className="bg-white shadow-md">
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">Page {i + 1}</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            {/* This would be the actual PDF page content */}
            <p className="text-gray-800">
              This is simulated content for page {i + 1} of the PDF document.
            </p>
            <p className="text-gray-500 mt-2">
              In a real implementation, this would display the actual PDF content.
            </p>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center justify-between w-full">
        <div className="flex items-center">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 mr-2"
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-5 w-5 text-gray-700" />
          </button>
          <span className="text-gray-700 mx-2">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 ml-2"
            disabled={zoom >= 2}
          >
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        <div className="text-gray-700">
          Page {currentPage} of {numPages}
        </div>
        
        <div className="flex items-center">
          <button
            onClick={prevPage}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 mr-2"
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={nextPage}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            disabled={currentPage >= numPages}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      <div 
        className="relative overflow-hidden rounded-lg shadow-lg" 
        style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: 'center top',
          transition: 'transform 0.3s ease'
        }}
      >
        <HTMLFlipBook
          width={550}
          height={733}
          size="fixed"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          showCover={true}
          flippingTime={1000}
          className="mx-auto"
          ref={bookRef}
          onFlip={handlePageChange}
          startPage={0}
          useMouseEvents={true}
        >
          {pages}
        </HTMLFlipBook>
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="flex space-x-2">
          {Array.from({ length: numPages }, (_, i) => (
            <button
              key={i}
              onClick={() => bookRef.current?.pageFlip().flip(i)}
              className={`w-3 h-3 rounded-full ${
                currentPage === i + 1 ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;