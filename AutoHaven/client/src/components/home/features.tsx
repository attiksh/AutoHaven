import { Verified, Search, MessageCircle, Star, Shield, Phone } from "@/components/ui/icons";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-card hover:shadow-hover transition-all duration-300">
      <div className="text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function Features() {
  const features = [
    {
      icon: <Verified className="text-3xl" />,
      title: "Verified Listings",
      description: "Every vehicle is checked and verified to ensure you get accurate information."
    },
    {
      icon: <Search className="text-3xl" />,
      title: "Advanced Search",
      description: "Our powerful search tools help you find exactly what you're looking for."
    },
    {
      icon: <MessageCircle className="text-3xl" />,
      title: "Direct Messaging",
      description: "Connect directly with sellers to ask questions and negotiate with ease."
    },
    {
      icon: <Star className="text-3xl" />,
      title: "Reviews & Ratings",
      description: "Read real experiences from verified buyers to help make your decision."
    },
    {
      icon: <Shield className="text-3xl" />,
      title: "Secure Platform",
      description: "Your data and transactions are protected with industry-leading security."
    },
    {
      icon: <Phone className="text-3xl" />,
      title: "Mobile Friendly",
      description: "Shop for your next car anytime, anywhere with our responsive design."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AutoHaven</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're building the most comprehensive platform for buying and selling cars with features designed for today's drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
