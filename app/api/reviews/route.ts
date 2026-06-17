import { NextResponse } from "next/server"

const MOCK_REVIEWS = {
  result: {
    name: "ATCON Construction",
    rating: 4.9,
    user_ratings_total: 128,
    reviews: [
      {
        author_name: "John Smith",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=John+Smith&background=random",
        rating: 5,
        relative_time_description: "a month ago",
        text: "Incredible experience working with ATCON Construction. They were professional, timely, and delivered exactly what they promised. The craftsmanship on our new office building is outstanding.",
        time: 1681234567,
      },
      {
        author_name: "Sarah Jenkins",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random",
        rating: 5,
        relative_time_description: "3 months ago",
        text: "We hired ATCON for a major commercial renovation. The project manager was communicative, and any issues that arose were handled swiftly. Highly recommend their services!",
        time: 1675234567,
      },
      {
        author_name: "Michael Chen",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
        rating: 5,
        relative_time_description: "4 months ago",
        text: "Top-tier construction company. Their attention to detail and commitment to safety standards gave us peace of mind throughout the entire build process.",
        time: 1672234567,
      },
      {
        author_name: "Emily Robinson",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=Emily+Robinson&background=random",
        rating: 4,
        relative_time_description: "6 months ago",
        text: "Very reliable and solid work. They completed our warehouse expansion slightly ahead of schedule. Great team of professionals.",
        time: 1667234567,
      },
      {
        author_name: "David Alaba",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=David+Alaba&background=random",
        rating: 5,
        relative_time_description: "8 months ago",
        text: "ATCON's architecture and construction teams work seamlessly together. They brought our vision to life with zero headaches. The best in the business.",
        time: 1661234567,
      }
    ]
  }
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  // If no keys are configured, return mock data so the UI doesn't break
  if (!apiKey || !placeId) {
    console.warn("Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID. Returning mock data.")
    return NextResponse.json(MOCK_REVIEWS.result)
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`
    const response = await fetch(url, { next: { revalidate: 3600 } }) // Cache for 1 hour
    
    if (!response.ok) {
      throw new Error(`Google API responded with status ${response.status}`)
    }

    const data = await response.json()
    
    if (data.error_message) {
      console.error("Google API Error:", data.error_message)
      throw new Error(data.error_message)
    }

    return NextResponse.json(data.result)
  } catch (error) {
    console.error("Error fetching Google Reviews:", error)
    // Fallback to mock data if the API request fails
    return NextResponse.json(MOCK_REVIEWS.result)
  }
}
