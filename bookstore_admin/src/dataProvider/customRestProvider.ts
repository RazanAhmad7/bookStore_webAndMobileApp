import { DataProvider } from 'react-admin';

const API_URL = 'http://localhost:5070/api';

// Custom upload function
export const uploadFile = async (file: File): Promise<string> => {
    console.log('Starting file upload:', file.name, file.size, file.type);
    
    const formData = new FormData();
    formData.append('file', file);

    console.log('FormData created, sending request to:', `${API_URL}/fileupload/upload`);

    const response = await fetch(`${API_URL}/fileupload/upload`, {
        method: 'POST',
        body: formData,
    });

    console.log('Upload response status:', response.status);
    console.log('Upload response headers:', response.headers);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    return result.url;
};

const customRestProvider: DataProvider = {
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
        const { field, order } = params.sort || { field: 'id', order: 'ASC' };
        
        // Debug: Log the incoming parameters
        console.log('DataProvider getList called with:', {
            resource,
            filter: params.filter,
            pagination: params.pagination,
            sort: params.sort
        });
        
        const query = {
            ...params.filter,
            _sort: field,
            _order: order,
            _start: (page - 1) * perPage,
            _end: page * perPage,
        };
        
        // Debug: Log the query object
        console.log('Query object:', query);
        
        // Build query string from query object
        const queryString = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryString.append(key, String(value));
            }
        });
        
        const url = `${API_URL}/${resource}?${queryString.toString()}`;
        
        try {
            console.log(`Fetching ${resource} from ${url}`);
            const response = await fetch(url);
            
            console.log(`Response status: ${response.status} for ${url}`);
            
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status} for ${url}`);
                // Return empty data instead of throwing error for 404
                if (response.status === 404) {
                    return {
                        data: [],
                        total: 0,
                    };
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`Received data for ${resource}:`, data);
            
            // Transform data for books list display
            if (resource === 'books' && data) {
                data.forEach((book: any) => {
                    // Convert relative image URLs to absolute
                    if (book.coverImagePath && book.coverImagePath.startsWith('/')) {
                        book.coverImagePath = `${API_URL.replace('/api', '')}${book.coverImagePath}`;
                    }
                    
                    // Handle many-to-many author relationships for display
                    if (book.bookAuthors && book.bookAuthors.length > 0) {
                        // Use the first author for display (or you could show "Multiple Authors")
                        book.author = book.bookAuthors[0].author;
                    }
                });
            }
            
            return {
                data: data || [],
                total: data ? data.length : 0,
            };
        } catch (error) {
            console.error(`Error fetching ${resource}:`, error);
            // Return empty data instead of throwing error
            return {
                data: [],
                total: 0,
            };
        }
    },

    getOne: async (resource, params) => {
        const url = `${API_URL}/${resource}/${params.id}`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Debug: Log the raw data from backend (remove in production)
            // if (resource === 'books') {
            //     console.log('Raw book data from backend:', data);
            // }
            
            // Transform data for books to match form expectations
            if (resource === 'books') {
                // Extract category IDs from BookCategories relationship
                if (data.bookCategories && Array.isArray(data.bookCategories)) {
                    data.categoryIds = data.bookCategories.map((bc: any) => bc.categoryId);
                } else {
                    data.categoryIds = [];
                }
                
                // Extract author IDs from BookAuthors relationship
                if (data.bookAuthors && Array.isArray(data.bookAuthors)) {
                    data.authorIds = data.bookAuthors.map((ba: any) => ba.authorId);
                } else {
                    data.authorIds = [];
                }
                
                // Handle image display - if we have a path, create a preview
                if (data.coverImagePath) {
                    // Make sure the path is absolute
                    let imagePath = data.coverImagePath;
                    if (imagePath.startsWith('/')) {
                        imagePath = `${API_URL.replace('/api', '')}${imagePath}`;
                    }
                    // Set both coverImage and coverImagePreview for compatibility
                    data.coverImage = imagePath;
                    data.coverImagePreview = imagePath;
                    console.log('Image path processed:', imagePath);
                } else {
                    console.log('No coverImagePath found in book data');
                }
            }
            
            // Debug: Log the transformed data (remove in production)
            // if (resource === 'books') {
            //     console.log('Transformed book data:', data);
            // }
            
            return { data };
        } catch (error) {
            console.error(`Error fetching ${resource}/${params.id}:`, error);
            throw error;
        }
    },

    getMany: async (resource, params) => {
        const query = `id=${params.ids.join('|')}`;
        const url = `${API_URL}/${resource}?${query}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { data };
    },

    getManyReference: async (resource, params) => {
        const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
        const { field, order } = params.sort || { field: 'id', order: 'ASC' };
        const query = {
            ...params.filter,
            [params.target]: params.id,
            _sort: field,
            _order: order,
            _start: (page - 1) * perPage,
            _end: page * perPage,
        };
        const url = `${API_URL}/${resource}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return {
            data: data,
            total: data.length,
        };
    },

    create: async (resource, params) => {
        const url = `${API_URL}/${resource}`;
        
        // Handle file uploads for books
        if (resource === 'books' && params.data.coverImage instanceof File) {
            const formData = new FormData();
            
            // Append all form fields
            Object.keys(params.data).forEach(key => {
                if (key === 'coverImage') {
                    formData.append('coverImage', params.data[key]);
                } else if (key === 'categoryIds' || key === 'authorIds') {
                    // Handle array fields - ensure it's an array
                    const ids = Array.isArray(params.data[key]) ? params.data[key] : [params.data[key]];
                    ids.forEach((id: number) => {
                        if (id != null && id !== 0) {
                            formData.append(key, id.toString());
                        }
                    });
                } else {
                    formData.append(key, params.data[key]);
                }
            });
            
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return { data };
        }
        
        // Regular JSON request for other resources
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params.data),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { data };
    },

    update: async (resource, params) => {
        const url = `${API_URL}/${resource}/${params.id}`;
        
        // Handle books with many-to-many relationships
        if (resource === 'books') {
            console.log('Updating book with data:', params.data);
            const formData = new FormData();
            
            // Append all form fields
            Object.keys(params.data).forEach(key => {
                // Skip the id field - backend gets it from the route parameter
                if (key === 'id') {
                    return;
                }
                
                if (key === 'coverImage' && params.data[key] instanceof File) {
                    formData.append('coverImage', params.data[key]);
                } else if (key === 'categoryIds' || key === 'authorIds') {
                    // Handle array fields - ensure it's an array
                    const ids = Array.isArray(params.data[key]) ? params.data[key] : [params.data[key]];
                    ids.forEach((id: number) => {
                        if (id != null && id !== 0) {
                            formData.append(key, id.toString());
                        }
                    });
                } else if (key !== 'coverImage') {
                    // Add all other fields as form data
                    if (params.data[key] !== null && params.data[key] !== undefined) {
                        formData.append(key, params.data[key].toString());
                    }
                }
            });
            
            // Debug: Log form data contents
            console.log('Form data contents:');
            Array.from(formData.entries()).forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
            });
            
            const response = await fetch(url, {
                method: 'PUT',
                body: formData,
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return { data };
        }
        
        // Regular JSON request for other resources
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params.data),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { data };
    },

    updateMany: async (resource, params) => {
        const promises = params.ids.map(id =>
            fetch(`${API_URL}/${resource}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params.data),
            })
        );
        
        const responses = await Promise.all(promises);
        
        if (!responses.every(response => response.ok)) {
            throw new Error('Some updates failed');
        }
        
        return { data: params.ids };
    },

    delete: async (resource, params) => {
        const url = `${API_URL}/${resource}/${params.id}`;
        const response = await fetch(url, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return { data: params.previousData! };
    },

    deleteMany: async (resource, params) => {
        const promises = params.ids.map(id =>
            fetch(`${API_URL}/${resource}/${id}`, {
                method: 'DELETE',
            })
        );
        
        const responses = await Promise.all(promises);
        
        if (!responses.every(response => response.ok)) {
            throw new Error('Some deletions failed');
        }
        
        return { data: params.ids };
    },
};

export default customRestProvider;
