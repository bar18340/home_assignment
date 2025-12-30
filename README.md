# SVG Processor - Full-Stack Application

A full-stack application that allows uploading SVG files, processing them on the backend, storing the processed data in MongoDB, and displaying an interactive preview using HTML Canvas on the frontend.

## 🚀 Live Demo

**🌐 [Try the Live App](https://svg-processor-eight.vercel.app/)**

The application is deployed and running on:
- **Frontend**: [Vercel](https://svg-processor-eight.vercel.app/)
- **Backend API**: [Render](https://svg-processor-backend.onrender.com)
- **Database**: MongoDB Atlas

> **Note**: First load may take 30-60 seconds as the free tier backend wakes up from sleep.

Want to deploy your own instance? See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete instructions.

## Features

- **Upload SVG Files**: Simple drag-and-drop or file selection interface
- **Automatic Processing**: Parses SVG files to extract rectangles and metadata
- **Issue Detection**: Identifies empty SVGs and out-of-bounds rectangles
- **Interactive Canvas Preview**: View SVG content rendered on HTML Canvas with hover interactions
- **Metrics Calculation**: Computes coverage ratio and item counts
- **Full CRUD API**: RESTful API for managing designs

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database and ODM
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** with **TypeScript**
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **HTML Canvas** - Interactive SVG preview

## Project Structure

```
home_assignment/
├── backend/
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic (SVG processing)
│   │   ├── middleware/    # Upload middleware
│   │   ├── types/         # TypeScript type definitions
│   │   └── index.ts       # Entry point
│   ├── uploads/           # Uploaded SVG files storage
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components (CanvasPreview)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
└── examples/              # Sample SVG files for testing
    ├── example-a-valid.svg
    ├── example-b-out-of-bounds.svg
    └── example-c-empty.svg
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v6 or higher)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd home_assignment
```

### 2. Set Up MongoDB

Install MongoDB locally following the [official documentation](https://docs.mongodb.com/manual/installation/).

**For Windows:**
- Download from https://www.mongodb.com/try/download/community
- Install as a Windows Service (recommended)
- MongoDB will start automatically

**For macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**For Linux:**
```bash
# Follow official docs for your distribution
# Start MongoDB:
mongod --dbpath /path/to/data/directory
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default values should work for local development)
# PORT=3001
# MONGODB_URI=mongodb://localhost:27017/svg-processor
# NODE_ENV=development

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:3000`

## API Endpoints

### Upload SVG File
```
POST /api/designs/upload
Content-Type: multipart/form-data

Body: { svg: <file> }

Response: {
  id: string,
  filename: string,
  status: string,
  message: string
}
```

### Get All Designs
```
GET /api/designs

Response: Array<{
  _id: string,
  filename: string,
  status: string,
  itemsCount: number,
  coverageRatio: number,
  issues: string[],
  createdAt: string
}>
```

### Get Single Design
```
GET /api/designs/:id

Response: {
  _id: string,
  filename: string,
  status: string,
  svgWidth: number,
  svgHeight: number,
  items: Array<Rectangle>,
  itemsCount: number,
  coverageRatio: number,
  issues: string[],
  createdAt: string
}
```

### Health Check
```
GET /api/health

Response: { status: 'ok', message: 'SVG Processor API is running' }
```

## SVG Processing

The application processes SVG files and extracts:

- **SVG Dimensions**: Width and height of the canvas
- **Rectangles**: All `<rect>` elements with x, y, width, height, and fill color
- **Item Count**: Number of rectangles found
- **Coverage Ratio**: Total area of rectangles divided by canvas area
- **Issues Detected**:
  - `EMPTY`: No rectangles in the SVG
  - `OUT_OF_BOUNDS`: Rectangle extends beyond the SVG canvas bounds

## Canvas Preview Features

- **Automatic Scaling**: SVG content is scaled to fit the canvas while preserving aspect ratio
- **Padding**: 20px padding around content for better visibility
- **Visual Highlighting**: Out-of-bounds rectangles are highlighted with red borders
- **Hover Interaction**: Hover over rectangles to see detailed information:
  - Position (x, y)
  - Size (width × height)
  - Fill color
  - Issues (if any)
- **Responsive Tooltip**: Shows rectangle details on hover

## Testing the Application

Sample SVG files are provided in the `examples/` directory:

1. **example-a-valid.svg**: Valid SVG with 3 rectangles, all within bounds
2. **example-b-out-of-bounds.svg**: SVG with an out-of-bounds rectangle
3. **example-c-empty.svg**: Empty SVG with no rectangles

### Test Flow

1. Navigate to `http://localhost:3000`
2. Click "Choose File" and select one of the example SVG files
3. Click "Upload"
4. Wait for processing to complete
5. View the design in the list
6. Click "View Details" to see the canvas preview and detailed information
7. Hover over rectangles in the canvas to see their details

## Environment Variables

### Backend (.env)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/svg-processor
NODE_ENV=development
```

### Frontend

The frontend uses Vite's proxy configuration (in `vite.config.ts`) to forward `/api` requests to the backend during development.

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

The compiled JavaScript will be in the `dist/` directory.

### Frontend

```bash
cd frontend
npm run build
```

The production-ready static files will be in the `dist/` directory. You can serve these using any static file server (nginx, Apache, etc.).

## Development Notes

- The backend creates an `uploads/` directory to store uploaded SVG files
- MongoDB connection is established before the server starts
- CORS is enabled for cross-origin requests
- File uploads are limited to 5MB
- Only `.svg` files are accepted
- The canvas uses a fixed size of 600×400px with automatic scaling

## Troubleshooting

### MongoDB Connection Issues

- **Windows**: Check MongoDB service is running in Services
- **macOS**: Run `brew services list` to check MongoDB status
- **Linux**: Run `sudo systemctl status mongod`
- Check the `MONGODB_URI` in your `backend/.env` file
- Verify MongoDB is accessible at the specified port (default: 27017)

### Port Already in Use

- Backend: Change `PORT` in `backend/.env`
- Frontend: Change `port` in `frontend/vite.config.ts`

### File Upload Fails

- Check file size (max 5MB)
- Ensure file has `.svg` extension
- Verify the `uploads/` directory exists and is writable

## License

ISC

## Author

Built as a full-stack home assignment demonstrating end-to-end development skills.
