import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Brain, ArrowLeft, FlaskConical, Landmark } from 'lucide-react';

export function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-blue-900">ResearchIQ</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
        <p className="text-gray-600 mb-10">
          Researchers and funders register separately. Managers, department heads, and administrators are provisioned by your institution.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card
            className="p-8 shadow-md border border-gray-100 hover:border-blue-200 cursor-pointer transition-colors"
            onClick={() => navigate('/signup/researcher')}
          >
            <div className="w-12 h-12 rounded-lg bg-blue-900 flex items-center justify-center mb-4">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Researcher</h2>
            <p className="text-gray-600 text-sm mb-6">
              Apply for verification. Publication keywords are reviewed to build your expertise profile — there is no manual expertise field.
            </p>
            <Button className="w-full bg-blue-900 hover:bg-blue-950">Continue as researcher</Button>
          </Card>

          <Card
            className="p-8 shadow-md border border-gray-100 hover:border-blue-200 cursor-pointer transition-colors"
            onClick={() => navigate('/signup/funder')}
          >
            <div className="w-12 h-12 rounded-lg bg-blue-900 flex items-center justify-center mb-4">
              <Landmark className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Funder / investor</h2>
            <p className="text-gray-600 text-sm mb-6">
              Register your organization to discover funded research opportunities. Applications are reviewed before activation.
            </p>
            <Button className="w-full bg-blue-900 hover:bg-blue-950 text-white">Continue as funder</Button>
          </Card>
        </div>

        <p className="text-center mt-10 text-gray-600">
          Already registered?{' '}
          <button type="button" className="text-blue-900 font-medium hover:underline" onClick={() => navigate('/login')}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
