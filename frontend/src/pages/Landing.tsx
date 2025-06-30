import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  Shield, 
  Zap, 
  ArrowRight,
} from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Save Valuable Time",
      description: "Input once, use everywhere. No more repetitive form filling."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Fill",
      description: "Paste URL, auto-fill forms. It's that simple."
    },
    // {
    //   icon: <Shield className="w-6 h-6" />,
    //   title: "Secure",
    //   description: "Your data stays on your device. Complete privacy."
    // }
  ];

  const steps = [
    "Save your profile once",
    "Paste any Google Form URL", 
    "Watch it auto-fill instantly"
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-semibold tracking-tight">FormFiller</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold leading-none mb-8 tracking-tight text-gray-500">
              Autofill the boring stuff.
              <span className="text-white"> Focus</span>
              <br />on what matters.
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
              Automate college recruitment applications. Save once, fill instantly. 
            </p>
            <SignInButton mode="modal">
            <button 
              onClick={() => navigate('/dashboard')}
              className="group bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-3 w-fit"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            </SignInButton>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-gray-800/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-1">
        <h2 className="text-3xl font-bold mb-12">
          Why Students Love FormFiller
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Built specifically for college students facing the recruitment season chaos
        </p>
      </div>
    </div>
  </section>

      {/* Features */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-center">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12">How it works</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm font-medium group-hover:bg-white group-hover:text-black transition-all duration-200">
                  {index + 1}
                </div>
                <span className="text-lg text-gray-400 group-hover:text-white transition-colors duration-200">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-black" />
              </div>
              <span className="font-semibold">FormFiller</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 FormFiller. Made for students.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;