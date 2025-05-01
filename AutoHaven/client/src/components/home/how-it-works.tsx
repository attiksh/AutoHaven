import { Search, MessageCircle, Handshake } from "@/components/ui/icons";

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How AutoHaven Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes buying and selling vehicles easier than ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto bg-primary-100 text-primary rounded-full mb-4">
              <Search className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Search & Discover</h3>
            <p className="text-gray-600">
              Browse thousands of listings with detailed specifications and high-quality photos.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto bg-primary-100 text-primary rounded-full mb-4">
              <MessageCircle className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect & Communicate</h3>
            <p className="text-gray-600">
              Message sellers directly to ask questions, schedule viewings, or negotiate prices.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto bg-primary-100 text-primary rounded-full mb-4">
              <Handshake className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Purchase & Enjoy</h3>
            <p className="text-gray-600">
              Complete the transaction with confidence and drive away in your new vehicle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
