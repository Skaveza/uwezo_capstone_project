import { Card, CardContent } from './ui/card';
import { Info } from 'lucide-react';

export function LoginInstructions() {
  return (
    <Card className="mt-4 border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 mb-2">Quick Start Guide:</p>
            <ul className="space-y-1 text-amber-700">
              <li>• <strong>Demo Login:</strong> Click "Try Demo Account" for instant access</li>
              <li>• <strong>Manual Login:</strong> Use admin@uwezo.ai / password</li>
              <li>• <strong>Create Account:</strong> Click "Sign up here" to create a new account</li>
              <li>• <strong>All passwords:</strong> Use "password" for any account</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

