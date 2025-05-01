import { Link } from "wouter";
import { DirectionsCar, FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/icons";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <DirectionsCar className="w-6 h-6 text-primary-500 mr-2" />
              <span className="font-bold text-xl">AutoHaven</span>
            </div>
            <p className="text-gray-400 mb-4">
              The modern way to buy and sell cars online. Connecting buyers and sellers with a seamless experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/cars" className="text-gray-400 hover:text-white">Search Cars</Link></li>
              <li><Link href="/profile" className="text-gray-400 hover:text-white">Sell Your Car</Link></li>
              <li><Link href="/cars?filter=finance" className="text-gray-400 hover:text-white">Car Finance</Link></li>
              <li><Link href="/cars" className="text-gray-400 hover:text-white">Car Reviews</Link></li>
              <li><Link href="/cars" className="text-gray-400 hover:text-white">Car Valuation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><Link href="/#how-it-works" className="text-gray-400 hover:text-white">Our Story</Link></li>
              <li><Link href="/#how-it-works" className="text-gray-400 hover:text-white">How It Works</Link></li>
              <li><Link href="/#testimonials" className="text-gray-400 hover:text-white">Testimonials</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} AutoHaven. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// All icons are imported from icons.tsx
