# ATCON Admin Portal Guide

## Access the Admin Portal

Visit: `http://localhost:3000/admin/login`

## Admin Credentials

**Email:** `admin@atcon.com`  
**Password:** `password123`

## Admin Portal Features

### 1. Dashboard
- **Location:** `/admin/dashboard`
- **Description:** Central hub for managing all content
- **Features:**
  - Quick access to all management sections
  - Statistics overview
  - Recent activity overview

### 2. Projects Management
- **Location:** `/admin/projects`
- **Features:**
  - View all projects organized by category
  - Create new projects with the following categories:
    - Residential
    - Commercial
    - Military
    - Mechanical Works
    - PEB Buildings
    - Highways
    - Educational
    - Sports
    - Religious
  - Edit project details (title, description, location, year completed)
  - Upload project images
  - Delete projects
  - **Access:** Click "Projects" in admin dashboard or navigate to `/admin/projects`

### 2b. Events Management
- **Location:** `/admin/events`
- **Features:**
  - Create and manage events you have organized or attended.
  - Automatically syncs with the public Events page.
  - Note: Under the hood, this uses the projects database table to prevent data disruption.
  - **Access:** Navigate to `/admin/events`

### 3. Team Management
- **Location:** `/admin/team`
- **Features:**
  - Add team members with full profiles
  - Include name, position, bio, and professional photo
  - Add contact information (email, phone)
  - Add social media links (LinkedIn, Twitter, etc.)
  - Delete team members
  - **Access:** Click "Team" in admin dashboard

### 4. Media Gallery
- **Location:** `/admin/media`
- **Features:**
  - Upload architectural photography
  - Organize by categories
  - Add descriptions and captions
  - Create lightbox galleries
  - Delete media files
  - **Access:** Click "Media" in admin dashboard

### 5. Services Management
- **Location:** `/admin/services`
- **Features:**
  - Create and edit service offerings
  - Add service descriptions and icons
  - Display on homepage in "Services Offered" section
  - Delete services
  - **Access:** Click "Services" in admin dashboard

### 6. Testimonials
- **Location:** `/admin/testimonials`
- **Features:**
  - Add client testimonials
  - Include client name, company, and photo
  - Add star ratings (1-5)
  - Featured testimonials on homepage
  - Delete testimonials
  - **Access:** Click "Testimonials" in admin dashboard

### 7. Contact Messages
- **Location:** `/admin/messages`
- **Features:**
  - View all contact form submissions
  - See message details (name, email, phone, message)
  - View submission timestamps
  - Mark as read/unread
  - Delete messages
  - **Access:** Click "Messages" in admin dashboard

## Database Structure

The website uses Supabase PostgreSQL database with the following tables:

- **admin_users** - Admin accounts and authentication
- **projects** - Project portfolio entries
- **team_members** - Team member profiles
- **media** - Gallery images and media
- **services** - Service offerings
- **testimonials** - Client testimonials
- **contact_messages** - Contact form submissions

## How to Add Content

### Adding a New Project
1. Go to Admin Dashboard → Projects
2. Click "Add New Project"
3. Fill in project details:
   - Project name
   - Category (from the 9 predefined categories)
   - Description
   - Location
   - Year completed
   - Upload images
4. Click "Create Project"
5. Project appears immediately on the public website

### Adding a Team Member
1. Go to Admin Dashboard → Team
2. Click "Add Team Member"
3. Enter details:
   - Full name
   - Position/Title
   - Bio/Description
   - Upload photo
   - Email and phone
   - Social media links
4. Click "Add Member"
5. Appears on public Team page

### Adding a Service
1. Go to Admin Dashboard → Services
2. Click "Add Service"
3. Enter:
   - Service name
   - Description
   - Icon (optional)
4. Click "Create Service"
5. Appears in "Services Offered" section on homepage

### Adding to Media Gallery
1. Go to Admin Dashboard → Media
2. Click "Upload Image"
3. Select image file
4. Add title and category
5. Click "Upload"
6. Image appears in public Media Gallery

## Security Notes

- Keep your admin credentials secure
- Never share the login credentials
- Admin sessions are secure and encrypted
- Passwords are hashed using SHA-256
- Access to admin portal is restricted to authenticated users only

## Troubleshooting

### Can't Login?
- Verify email is exactly: `admin@atcon.com`
- Verify password is exactly: `password123`
- Clear browser cache and try again
- Check that Supabase is connected and database is accessible

### Content Not Appearing?
- Refresh the public website page
- Check that content was saved successfully
- Verify Supabase connection is active

### Images Not Uploading?
- Check file size (recommended max 5MB)
- Verify file format (JPG, PNG, WebP supported)
- Check internet connection
- Verify Supabase storage is accessible
