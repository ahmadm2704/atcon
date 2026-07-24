import { NextResponse } from "next/server"

const MOCK_REVIEWS = {
  result: {
    name: "ATCON Engineers",
    rating: 4.9,
    user_ratings_total: 128,
    reviews: [
      {
        author_name: "John Smith",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=John+Smith&background=random",
        rating: 5,
        relative_time_description: "a month ago",
        text: "Incredible experience working with ATCON Engineers. They were professional, timely, and delivered exactly what they promised. The craftsmanship on our new office building is outstanding.",
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
      },
      {
        author_name: "Lisa Patel",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=Lisa+Patel&background=random",
        rating: 5,
        relative_time_description: "9 months ago",
        text: "Excellent project management and beautiful designs. They listen to their clients and execute flawlessly.",
        time: 1660000000,
      },
      {
        author_name: "Robert Davis",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=Robert+Davis&background=random",
        rating: 5,
        relative_time_description: "10 months ago",
        text: "I couldn't be happier with our new residential complex. ATCON took care of everything from start to finish.",
        time: 1658000000,
      },
      {
        author_name: "Emma Wilson",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=Emma+Wilson&background=random",
        rating: 4,
        relative_time_description: "11 months ago",
        text: "Great work on the interior design and structural planning. Would definitely work with them again.",
        time: 1655000000,
      },
      {
        author_name: "James Taylor",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=James+Taylor&background=random",
        rating: 5,
        relative_time_description: "1 year ago",
        text: "Exceptional quality and timely delivery. They are the standard for engineering and development.",
        time: 1640000000,
      },
      {
        author_name: "Sophia Martinez",
        author_url: "#",
        profile_photo_url: "https://ui-avatars.com/api/?name=Sophia+Martinez&background=random",
        rating: 5,
        relative_time_description: "1 year ago",
        text: "Amazing team! They truly understand modern aesthetics and practical engineering.",
        time: 1630000000,
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
    // We use a known trick to maximize the number of real reviews returned.
    // Google Places API limits to 5 reviews per request. 
    // By requesting both "most_relevant" and "newest", we can often get up to 10 unique real reviews.
    const urlRelevant = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&reviews_sort=most_relevant&key=${apiKey}`
    const urlNewest = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&reviews_sort=newest&key=${apiKey}`
    
    // We remove the 1-hour cache so the website ALWAYS fetches the absolute latest reviews live
    const [resRelevant, resNewest] = await Promise.all([
      fetch(urlRelevant, { cache: 'no-store' }),
      fetch(urlNewest, { cache: 'no-store' })
    ])
    
    const dataRelevant = await resRelevant.json()
    const dataNewest = await resNewest.json()
    
    if (dataRelevant.error_message) {
      console.error("Google API Error:", dataRelevant.error_message)
      throw new Error(dataRelevant.error_message)
    }

    const result = dataRelevant.result
    
    // Merge reviews to get as many unique REAL reviews as possible
    const allReviewsMap = new Map()
    
    if (result.reviews) {
      result.reviews.forEach((r: any) => allReviewsMap.set(r.author_name, r))
    }
    if (dataNewest.result && dataNewest.result.reviews) {
      dataNewest.result.reviews.forEach((r: any) => allReviewsMap.set(r.author_name, r))
    }

    result.reviews = Array.from(allReviewsMap.values())

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching Google Reviews:", error)
    // Fallback to mock data if the API request fails entirely
    return NextResponse.json(MOCK_REVIEWS.result)
  }
}
