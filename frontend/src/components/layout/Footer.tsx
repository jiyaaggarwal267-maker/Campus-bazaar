import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-white font-bold">Campus Bazaar</span>
            </div>
            <p className="text-sm max-w-sm">The trusted marketplace built for college students. Buy, sell, and trade safely on your campus.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-white transition-colors">Browse</Link></li>
              <li><Link to="/create-listing" className="hover:text-white transition-colors">Sell an item</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-ink-800 text-xs text-ink-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>© 2025 Campus Bazaar. Built by students, for students.</p>
          <p>Made with ♥ on every campus.</p>
        </div>
      </div>
    </footer>
  );
}
