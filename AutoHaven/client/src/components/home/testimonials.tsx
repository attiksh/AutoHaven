import { Star } from "@/components/ui/icons";
import { Rating } from "@/components/ui/rating";

interface TestimonialProps {
  rating: number;
  content: string;
  author: string;
  vehicle: string;
  avatar: string;
}

function Testimonial({ rating, content, author, vehicle, avatar }: TestimonialProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-hover transition-all duration-300">
      <div className="flex items-center mb-4">
        <Rating value={rating} color="text-amber-500" />
      </div>
      <p className="text-gray-700 mb-6">{content}</p>
      <div className="flex items-center">
        <div className="mr-4 w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
          <img src={avatar} alt={author} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{author}</h4>
          <p className="text-sm text-gray-500">{vehicle}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const testimonials = [
    {
      rating: 5,
      content: "Found my dream car in just two days. The search features made it easy to narrow down exactly what I wanted, and the messaging system helped me connect with the seller quickly.",
      author: "Michael S.",
      vehicle: "Purchased a Toyota Camry",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      rating: 4.5,
      content: "As a first-time seller, I was nervous about listing my car online. The platform made it incredibly simple, and I received multiple inquiries within hours of posting.",
      author: "Sarah J.",
      vehicle: "Sold a Honda Civic",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      rating: 5,
      content: "The detail in the listings is what sets this platform apart. I could see everything from service history to specific features, which made me confident in my purchase decision.",
      author: "David R.",
      vehicle: "Purchased a Ford F-150",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50" id="testimonials">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from people who have found their perfect vehicles through AutoHaven.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              rating={testimonial.rating}
              content={testimonial.content}
              author={testimonial.author}
              vehicle={testimonial.vehicle}
              avatar={testimonial.avatar}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
