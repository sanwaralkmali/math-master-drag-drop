# MathMaster - Educational Drag & Drop Game

An interactive educational game designed to help kids master high school mathematics through engaging drag-and-drop activities.

## 🎯 Mobile-First Design

This game has been specifically optimized for mobile devices and small screens, making it perfect for kids using tablets and phones:

### 📱 Mobile Optimizations

- **Touch-Friendly Interface**: Large touch targets (44px minimum) for easy interaction
- **Responsive Layout**: Adapts seamlessly from mobile to desktop
- **Kid-Friendly Design**:
  - Larger text and buttons for young users
  - Generous spacing between elements
  - Clear visual feedback during drag operations
  - Intuitive drop zones with visual cues

### 🎮 Game Features

- **Drag & Drop Mechanics**: Smooth, responsive drag-and-drop functionality
- **Multiple Categories**: Sort questions into different mathematical categories
- **Real-time Feedback**: Immediate visual feedback for correct/incorrect answers
- **Progress Tracking**: Score tracking and completion status
- **Timer**: Track time spent on each game session
- **Customizable Difficulty**: Choose from 8, 12, 16, or 24 questions

### 📱 Mobile Layout Improvements

#### Before (Desktop-focused):

- 3-column grid layout that cramped on mobile
- Complex drag-and-drop that was hard for kids
- Small touch targets difficult for children
- Text too small for young readers
- Poor spacing on small screens

#### After (Kid-Friendly Mobile):

- **Ultra-simple tap interface** - no complex dragging required
- **Compact single-column layout** optimized for small screens
- **Smaller, more manageable items** (40px minimum touch targets)
- **Tap-to-select, tap-to-move** interaction pattern
- **Clear visual feedback** with highlighting and "Move here" buttons
- **Compact spacing** to fit more content on small screens

### 🎨 Visual Enhancements

- **Compact Cards**: Optimized for small screens with efficient use of space
- **Clear Typography**: Readable text sizes appropriate for mobile
- **Enhanced Feedback**: Visual highlighting for selected items and clear action buttons
- **Improved Buttons**: Compact, accessible button sizes with clear labels
- **Touch-Optimized**: Simple tap interactions instead of complex drag-and-drop

### 🔧 Technical Improvements

- **Responsive Breakpoints**: Uses `useIsMobile()` hook for device detection
- **CSS Optimizations**: Mobile-specific styles for better performance
- **Simple Touch Interactions**: Tap-to-select and tap-to-move instead of complex drag-and-drop
- **Viewport Optimization**: Proper mobile viewport handling
- **Compact Layout**: Reduced spacing and smaller elements for small screens

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access the game with a skill parameter: `?skill=classification-numbers`

## 📚 Available Skills

- `classification-numbers` - Number classification exercises
- `algebra-builder` - Algebraic expression building
- `understanding-polynomials-classification` - Polynomial categorization

## 🎯 Target Audience

Perfect for:

- **Elementary and Middle School Students** (ages 8-14)
- **Mobile Device Users** (tablets and phones)
- **Educational Institutions** looking for interactive math tools
- **Parents** wanting to supplement their children's math education

## 🛠️ Built With

- **React** with TypeScript
- **Tailwind CSS** for responsive design
- **@hello-pangea/dnd** for drag-and-drop functionality
- **Lucide React** for icons
- **Vite** for fast development

## 📱 Mobile Testing

The game has been tested and optimized for:

- **iPhone** (iOS Safari)
- **Android** (Chrome, Samsung Internet)
- **iPad** (Safari, Chrome)
- **Small tablets** (7-10 inch screens)

## 🎨 Design Philosophy

The redesign focuses on **simplicity and accessibility first**, ensuring that:

- **No complex interactions** - simple tap instead of drag-and-drop
- **Compact layout** that fits well on small screens
- **Clear visual feedback** with highlighting and action buttons
- **Intuitive interface** that young children can understand immediately

This makes the educational game truly accessible to its target audience - kids learning math on their mobile devices, with an interface so simple that even very young children can use it independently!
