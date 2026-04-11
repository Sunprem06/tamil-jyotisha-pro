import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-sacred flex items-center justify-center">
                <span className="text-primary-foreground text-lg">ௐ</span>
              </div>
              <div>
                <h3 className="font-bold font-tamil">தமிழ் ஜோதிடம்</h3>
                <p className="text-xs opacity-80">Tamil Jothidam</p>
              </div>
            </div>
            <p className="text-sm opacity-80 font-tamil">
              வேத ஜோதிடத்தின் பழமையான ஞானத்துடன் உங்கள் எதிர்காலத்தை கண்டறியுங்கள்.
            </p>
          </div>

          <div>
            <h4 className="font-bold font-tamil mb-3">சேவைகள்</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/rasi" className="hover:opacity-100 font-tamil">ராசிபலன்</Link></li>
              <li><Link to="/birth-chart" className="hover:opacity-100 font-tamil">ஜாதகம்</Link></li>
              <li><Link to="/panchangam" className="hover:opacity-100 font-tamil">பஞ்சாங்கம்</Link></li>
              <li><Link to="/porutham" className="hover:opacity-100 font-tamil">பொருத்தம்</Link></li>
              <li><Link to="/dasha" className="hover:opacity-100 font-tamil">தசா புத்தி</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-tamil mb-3">மேலும்</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/dosha" className="hover:opacity-100 font-tamil">தோஷ பரிசோதனை</Link></li>
              <li><Link to="/transit" className="hover:opacity-100 font-tamil">கோசாரம்</Link></li>
              <li><Link to="/remedies" className="hover:opacity-100 font-tamil">பரிகாரம்</Link></li>
              <li><Link to="/muhurtham" className="hover:opacity-100 font-tamil">முகூர்த்தம்</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-tamil mb-3">நிறுவனம்</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/about" className="hover:opacity-100 font-tamil">எங்களைப் பற்றி</Link></li>
              <li><Link to="/contact" className="hover:opacity-100 font-tamil">தொடர்பு கொள்ள</Link></li>
              <li><a href="https://mhtsdigixr.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">Maanagarram Hi Tech Solutions</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-6 text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} All Rights Reserved. Maanagarram Hi Tech Solutions</p>
          <p className="mt-1 font-tamil">அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை @ மாநகரம் ஹை டெக் சொல்யூஷன்ஸ்</p>
        </div>
      </div>
    </footer>
  );
}
