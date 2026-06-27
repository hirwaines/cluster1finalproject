import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { AuthShell } from '../components/layout';
import { FlaskConical, Landmark } from 'lucide-react';
import { NCST } from '../content/ncst';

export function SignUpPage() {
  const navigate = useNavigate();

  return (
    <AuthShell maxWidth="lg">
      <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">Create an account</h1>
      <p className="text-muted-foreground mb-10">
        Researchers and funders register separately for the {NCST.shortName} case study platform. Research managers,
        department heads, and administrators are provisioned by their institution.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card
          className="p-8 shadow-md border border-border hover:border-brand/40 cursor-pointer transition-colors"
          onClick={() => navigate('/signup/researcher')}
        >
          <div className="w-12 h-12 rounded-lg bg-brand flex items-center justify-center mb-4">
            <FlaskConical className="w-7 h-7 text-brand-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Researcher</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Apply for verification at a partner institution. Your expertise profile is built from indexed publications
            and reviewed keywords.
          </p>
          <Button className="w-full">Continue as researcher</Button>
        </Card>

        <Card
          className="p-8 shadow-md border border-border hover:border-brand/40 cursor-pointer transition-colors"
          onClick={() => navigate('/signup/funder')}
        >
          <div className="w-12 h-12 rounded-lg bg-brand flex items-center justify-center mb-4">
            <Landmark className="w-7 h-7 text-brand-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Funder / partner</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Register your organisation to discover research aligned with {NCST.shortName} and national funding
            priorities. Applications are reviewed before activation.
          </p>
          <Button className="w-full">Continue as funder</Button>
        </Card>
      </div>

      <p className="text-center mt-10 text-muted-foreground">
        Already registered?{' '}
        <button type="button" className="text-brand font-medium hover:underline" onClick={() => navigate('/login')}>
          Log in
        </button>
      </p>
    </AuthShell>
  );
}
