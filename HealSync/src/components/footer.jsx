export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <h2 className="text-blue-500 text-2xl font-bold mb-3">HealSync</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your digital wellness companion — manage health records, schedule checkups, 
            and receive personalized reminders effortlessly.
          </p>
          <div className="mt-4 flex space-x-4 text-xl">
            <a href="#" className="hover:text-blue-500 transition-colors"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><i className="fab fa-github"></i></a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#dashboard" className="hover:text-blue-500 transition-colors">Dashboard</a></li>
            <li><a href="#features" className="hover:text-blue-500 transition-colors">Features</a></li>
            <li><a href="#testimonials" className="hover:text-blue-500 transition-colors">Testimonials</a></li>
            <li><a href="#blog" className="hover:text-blue-500 transition-colors">Blog</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#faq" className="hover:text-blue-500 transition-colors">FAQ</a></li>
            <li><a href="#privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
            <li><a href="#support" className="hover:text-blue-500 transition-colors">Support</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium">Email:</span>{" "}
              <a href="mailto:team@healsync.in" className="hover:text-blue-500 transition-colors">
                team@healsync.in
              </a>
            </li>
            <li><span className="font-medium">Phone:</span> +91 98765 43210</li>
            <li><span className="font-medium">Location:</span> IIIT Kota, India</li>
            <li><span className="font-medium">Hours:</span> Mon – Sat, 9AM – 7PM</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        <p>
          Made with <span className="text-blue-500">💙</span> by <span className="font-semibold text-blue-500">HealSync Team</span>
        </p>
        <p>© {new Date().getFullYear()} HealSync. All rights reserved.</p>
      </div>
    </footer>
  );
}
