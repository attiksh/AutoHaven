import { http, HttpResponse } from 'msw';

// Mock API handlers for testing
export const handlers = [
  // User endpoints
  http.get('/api/user', () => {
    // Simulate authenticated user
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
    });
  }),
  
  http.post('/api/login', async ({ request }) => {
    const body = await request.json();
    const { username, password } = body as { username: string; password: string };
    
    if (username === 'testuser' && password === 'password') {
      return HttpResponse.json({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
      });
    }
    
    return new HttpResponse(
      JSON.stringify({ message: 'Invalid credentials' }),
      { status: 401 }
    );
  }),
  
  http.post('/api/register', async ({ request }) => {
    const userData = await request.json() as { 
      username: string; 
      email: string; 
      name?: string;
    };
    
    return HttpResponse.json({
      id: 2,
      username: userData.username,
      email: userData.email,
      name: userData.name || '',
    }, { status: 201 });
  }),
  
  http.post('/api/logout', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  
  // Car endpoints
  http.get('/api/cars', () => {
    // Return sample car data
    return HttpResponse.json([
      {
        id: 1,
        title: '2020 Toyota Camry XSE - Low Miles, Like New',
        userId: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        price: 25900,
        mileage: 15000,
        condition: 'excellent',
        fuelType: 'gasoline',
        transmission: 'automatic',
        description: 'Beautiful Toyota Camry XSE with premium features including leather seats, panoramic sunroof, and advanced safety features.',
        location: 'Seattle, WA',
        features: ['Leather Seats', 'Sunroof', 'Backup Camera', 'Bluetooth', 'Navigation'],
        images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: '2018 Honda Civic - Great Condition, Fuel Efficient',
        userId: 2,
        make: 'Honda',
        model: 'Civic',
        year: 2018,
        price: 18500,
        mileage: 32000,
        condition: 'good',
        fuelType: 'gasoline',
        transmission: 'automatic',
        description: 'Well-maintained Honda Civic with excellent fuel economy.',
        location: 'Portland, OR',
        features: ['Backup Camera', 'Bluetooth', 'USB Port', 'Cruise Control'],
        images: ['https://images.unsplash.com/photo-1590577976322-3d2d6e2130d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
        createdAt: new Date().toISOString(),
      }
    ]);
  }),
  
  http.get('/api/cars/:id', ({ params }) => {
    const { id } = params;
    
    // Return a specific car by ID
    return HttpResponse.json({
      id: Number(id),
      title: '2020 Toyota Camry XSE - Low Miles, Like New',
      userId: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      price: 25900,
      mileage: 15000,
      condition: 'excellent',
      fuelType: 'gasoline',
      transmission: 'automatic',
      description: 'Beautiful Toyota Camry XSE with premium features including leather seats, panoramic sunroof, and advanced safety features.',
      location: 'Seattle, WA',
      features: ['Leather Seats', 'Sunroof', 'Backup Camera', 'Bluetooth', 'Navigation'],
      images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
      createdAt: new Date().toISOString(),
    });
  }),
  
  // Favorites endpoints
  http.get('/api/favorites', () => {
    return HttpResponse.json([
      {
        id: 1,
        userId: 1,
        carId: 2,
        createdAt: new Date().toISOString(),
      }
    ]);
  }),
  
  http.post('/api/favorites', async ({ request }) => {
    const body = await request.json();
    const { carId } = body as { carId: number };
    
    return HttpResponse.json({
      id: 2,
      userId: 1,
      carId,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),
  
  http.delete('/api/favorites/:carId', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  
  // Reviews endpoints
  http.get('/api/reviews/car/:carId', ({ params }) => {
    const { carId } = params;
    
    return HttpResponse.json([
      {
        id: 1,
        userId: 2,
        carId: Number(carId),
        rating: 4,
        comment: 'Great car, very reliable and comfortable.',
        createdAt: new Date().toISOString(),
      }
    ]);
  }),
  
  http.post('/api/reviews', async ({ request }) => {
    const reviewData = await request.json();
    
    return HttpResponse.json({
      id: 2,
      ...reviewData,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),
];