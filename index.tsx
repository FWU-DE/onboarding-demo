import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Mail, Lock, Shield, Users, Upload, AlertCircle, Eye, EyeOff, HelpCircle, Phone, MessageCircle, X } from 'lucide-react';

const OnboardingAssistant = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    schoolEmail: '',
    password: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    inviteMethod: '',
    teacherEmails: '',
    schildFile: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showHelp, setShowHelp] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const steps = [
    {
      title: 'Anmeldung mit Schul-E-Mail',
      icon: Mail,
      description: 'Geben Sie Ihre offizielle Schul-E-Mail-Adresse ein'
    },
    {
      title: 'Passwort erstellen',
      icon: Lock,
      description: 'Erstellen Sie ein sicheres Passwort für Ihren Account'
    },
    {
      title: 'Zwei-Faktor-Authentifizierung',
      icon: Shield,
      description: 'Empfohlen: Sichern Sie Ihren Account zusätzlich ab'
    },
    {
      title: 'Lehrkräfte einladen',
      icon: Users,
      description: 'Laden Sie Ihre Lehrkräfte über SchiLD-Import oder manuell ein'
    }
  ];

  const validateEmail = (email) => {
    const nrwSchoolDomains = ['.nrw.de', '.nrw.schule', '.schulen.de'];
    return email.includes('@') && nrwSchoolDomains.some(domain => email.includes(domain));
  };

  const validatePassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password) && 
           /[^A-Za-z0-9]/.test(password);
  };

  const handleNext = () => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.schoolEmail) {
        newErrors.schoolEmail = 'E-Mail-Adresse ist erforderlich';
      } else if (!validateEmail(formData.schoolEmail)) {
        newErrors.schoolEmail = 'Bitte geben Sie eine gültige NRW-Schul-E-Mail-Adresse ein';
      }
    }

    if (currentStep === 1) {
      if (!formData.password) {
        newErrors.password = 'Passwort ist erforderlich';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Passwort muss mindestens 8 Zeichen enthalten: Groß-, Kleinbuchstaben, Zahlen und Sonderzeichen';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwort-Bestätigung ist erforderlich';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
      }
    }

    if (currentStep === 3) {
      if (!formData.inviteMethod) {
        newErrors.inviteMethod = 'Bitte wählen Sie eine Einladungsmethode';
      } else if (formData.inviteMethod === 'manual' && !formData.teacherEmails.trim()) {
        newErrors.teacherEmails = 'Bitte geben Sie mindestens eine E-Mail-Adresse ein';
      } else if (formData.inviteMethod === 'schild' && !formData.schildFile) {
        newErrors.schildFile = 'Bitte wählen Sie eine SchiLD-Datei aus';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(Math.min(currentStep + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
    setErrors({});
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setFormData({ ...formData, schildFile: file });
      setErrors({ ...errors, schildFile: '' });
    } else {
      setErrors({ ...errors, schildFile: 'Bitte wählen Sie eine CSV- oder Excel-Datei aus' });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Mail className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Anmeldung mit Schul-E-Mail</h2>
              <p className="text-gray-600">Geben Sie Ihre offizielle Schul-E-Mail-Adresse ein, um Ihren Account zu erstellen.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schul-E-Mail-Adresse *
              </label>
              <input
                type="email"
                value={formData.schoolEmail}
                onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.schoolEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="schulleitung@musterschule.nrw.de"
              />
              {errors.schoolEmail && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{errors.schoolEmail}</span>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Hinweis:</strong> Verwenden Sie Ihre offizielle NRW-Schul-E-Mail-Adresse 
                  (z.B. mit den Endungen .nrw.de, .nrw.schule oder .schulen.de).
                Demo:
                  - schulleitung@musterschule.nrw.de
                  - direktor@gymnasium.nrw.schule
                  - leitung@grundschule.schulen.de
                </p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Lock className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sicheres Passwort erstellen</h2>
              <p className="text-gray-600">Erstellen Sie ein starkes Passwort für Ihren Account.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Neues Passwort *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Sicheres Passwort eingeben"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{errors.password}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passwort bestätigen *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Passwort wiederholen"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Passwort-Anforderungen:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                    <span className="mr-2">{formData.password.length >= 8 ? '✓' : '○'}</span>
                    Mindestens 8 Zeichen
                  </li>
                  <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-2">{/[A-Z]/.test(formData.password) ? '✓' : '○'}</span>
                    Mindestens ein Großbuchstabe
                  </li>
                  <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-2">{/[a-z]/.test(formData.password) ? '✓' : '○'}</span>
                    Mindestens ein Kleinbuchstabe
                  </li>
                  <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-2">{/[0-9]/.test(formData.password) ? '✓' : '○'}</span>
                    Mindestens eine Zahl
                  </li>
                  <li className={`flex items-center ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-2">{/[^A-Za-z0-9]/.test(formData.password) ? '✓' : '○'}</span>
                    Mindestens ein Sonderzeichen
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Zwei-Faktor-Authentifizierung</h2>
              <p className="text-gray-600">Erhöhen Sie die Sicherheit Ihres Accounts durch einen zweiten Faktor.</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-green-900 mb-2">Warum Zwei-Faktor-Authentifizierung?</h3>
                    <p className="text-green-700 text-sm mb-3">
                      Die 2FA schützt Ihren Account auch dann, wenn Ihr Passwort kompromittiert wird. 
                      Besonders für Schulleitungs-Accounts wird dies dringend empfohlen.
                    </p>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Schutz vor unbefugtem Zugriff</li>
                      <li>• Sicherheit für sensible Schuldaten</li>
                      <li>• Erfüllung von Datenschutzbestimmungen</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="twoFactor"
                    checked={formData.twoFactorEnabled === true}
                    onChange={() => setFormData({ ...formData, twoFactorEnabled: true })}
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Ja, 2FA aktivieren (empfohlen)</div>
                    <div className="text-sm text-gray-500">Sie erhalten einen QR-Code für Ihre Authenticator-App</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="twoFactor"
                    checked={formData.twoFactorEnabled === false}
                    onChange={() => setFormData({ ...formData, twoFactorEnabled: false })}
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Später aktivieren</div>
                    <div className="text-sm text-gray-500">Sie können 2FA jederzeit in den Einstellungen aktivieren</div>
                  </div>
                </label>
              </div>

              {formData.twoFactorEnabled && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Empfohlene Authenticator-Apps:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Google Authenticator</li>
                    <li>• Microsoft Authenticator</li>
                    <li>• Authy</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Lehrkräfte einladen</h2>
              <p className="text-gray-600">Laden Sie Ihre Lehrkräfte über SchiLD-Import oder manuelle Eingabe ein.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Einladungsmethode wählen:</h3>
                
                <div className="space-y-3">
                  <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="inviteMethod"
                      value="schild"
                      checked={formData.inviteMethod === 'schild'}
                      onChange={(e) => setFormData({ ...formData, inviteMethod: e.target.value })}
                      className="mt-1 mr-3 h-4 w-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Upload className="h-5 w-5 text-blue-600 mr-2" />
                        <div className="font-medium text-gray-900">SchiLD-Import (empfohlen)</div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Importieren Sie Lehrkraftdaten direkt aus SchiLD (CSV oder Excel)
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="inviteMethod"
                      value="manual"
                      checked={formData.inviteMethod === 'manual'}
                      onChange={(e) => setFormData({ ...formData, inviteMethod: e.target.value })}
                      className="mt-1 mr-3 h-4 w-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-600 mr-2" />
                        <div className="font-medium text-gray-900">Manuelle Eingabe</div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Geben Sie E-Mail-Adressen der Lehrkräfte manuell ein
                      </div>
                    </div>
                  </label>
                </div>

                {errors.inviteMethod && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{errors.inviteMethod}</span>
                  </div>
                )}
              </div>

              {formData.inviteMethod === 'schild' && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SchiLD-Datei hochladen
                  </label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.schildFile && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ Datei ausgewählt: {formData.schildFile.name}
                    </div>
                  )}
                  {errors.schildFile && (
                    <div className="flex items-center mt-2 text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{errors.schildFile}</span>
                    </div>
                  )}
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700">
                      <strong>Hinweis:</strong> Die Datei sollte mindestens die Spalten "E-Mail" und "Name" enthalten. 
                      Unterstützte Formate: CSV, Excel (.xlsx, .xls)
                    </p>
                  </div>
                </div>
              )}

              {formData.inviteMethod === 'manual' && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail-Adressen der Lehrkräfte
                  </label>
                  <textarea
                    value={formData.teacherEmails}
                    onChange={(e) => setFormData({ ...formData, teacherEmails: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.teacherEmails ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    rows="6"
                    placeholder="max.mustermann@musterschule.nrw.de&#10;anna.schmidt@musterschule.nrw.de&#10;peter.mueller@musterschule.nrw.de"
                  />
                  {errors.teacherEmails && (
                    <div className="flex items-center mt-2 text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{errors.teacherEmails}</span>
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    Geben Sie eine E-Mail-Adresse pro Zeile ein
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup erfolgreich abgeschlossen!</h2>
              <p className="text-gray-600">Ihr Account wurde erfolgreich eingerichtet und die Einladungen wurden versendet.</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Was passiert als nächstes?</h3>
                <ul className="text-green-700 text-sm space-y-2">
                  <li>✓ Ihr Schulleitung-Account ist aktiv</li>
                  <li>✓ {formData.twoFactorEnabled ? 'Zwei-Faktor-Authentifizierung ist aktiviert' : 'Sie können 2FA in den Einstellungen aktivieren'}</li>
                  <li>✓ Einladungen wurden an {formData.inviteMethod === 'schild' ? 'die Lehrkräfte aus der SchiLD-Datei' : 'die eingegebenen E-Mail-Adressen'} versendet</li>
                  <li>✓ Die Lehrkräfte erhalten E-Mails mit Anweisungen zur Account-Erstellung</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Nächste Schritte:</h3>
                <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                  <li>Informieren Sie Ihre Lehrkräfte über die versendeten Einladungen</li>
                  <li>Überprüfen Sie regelmäßig den Status der Account-Erstellungen im Admin-Bereich</li>
                  <li>Bei Fragen steht Ihnen der Support zur Verfügung</li>
                </ol>
              </div>

              <div className="flex justify-center">
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Zum Dashboard
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const faqData = [
    {
      question: "Welche E-Mail-Adresse sollte ich verwenden?",
      answer: "Verwenden Sie Ihre offizielle NRW-Schul-E-Mail-Adresse mit Endungen wie .nrw.de, .nrw.schule oder .schulen.de. Diese wird für die Verifizierung Ihrer Berechtigung benötigt."
    },
    {
      question: "Wie sicher ist mein Passwort?",
      answer: "Ihr Passwort muss mindestens 8 Zeichen lang sein und Groß- und Kleinbuchstaben, Zahlen sowie Sonderzeichen enthalten. Wir empfehlen zusätzlich die Aktivierung der Zwei-Faktor-Authentifizierung."
    },
    {
      question: "Was ist SchiLD-Import?",
      answer: "SchiLD ist das Schulverwaltungsprogramm in NRW. Sie können Lehrkraftdaten direkt aus SchiLD exportieren und hier hochladen, anstatt alle E-Mail-Adressen manuell einzugeben."
    },
    {
      question: "Können Lehrkräfte ihre Accounts später selbst verwalten?",
      answer: "Ja, nach der Registrierung können Lehrkräfte ihre Profile selbst verwalten, Passwörter ändern und Sicherheitseinstellungen anpassen."
    },
    {
      question: "Was passiert, wenn eine Lehrkraft die Einladung nicht erhält?",
      answer: "Sie können Einladungen über das Admin-Dashboard erneut versenden oder neue Lehrkräfte jederzeit hinzufügen."
    }
  ];

  const renderHelpOverlay = () => {
    if (!showHelp) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Hilfe & Anleitung</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Schritt-für-Schritt Anleitung</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">1. E-Mail-Adresse eingeben</h4>
                    <p className="text-sm text-gray-600">Verwenden Sie Ihre offizielle NRW-Schul-E-Mail-Adresse für die Verifizierung.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                    <Lock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">2. Sicheres Passwort erstellen</h4>
                    <p className="text-sm text-gray-600">Folgen Sie den Sicherheitsanforderungen für ein starkes Passwort.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">3. Zwei-Faktor-Authentifizierung</h4>
                    <p className="text-sm text-gray-600">Aktivieren Sie 2FA für zusätzliche Sicherheit Ihres Schulleitung-Accounts.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">4. Lehrkräfte einladen</h4>
                    <p className="text-sm text-gray-600">Laden Sie Lehrkräfte über SchiLD-Import oder manuelle Eingabe ein.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Wichtige Hinweise</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Alle Daten werden verschlüsselt übertragen und gespeichert</li>
                <li>• Die Registrierung ist nur für verifizierte NRW-Schulen möglich</li>
                <li>• Bei technischen Problemen wenden Sie sich an den Support</li>
                <li>• Die Aktivierung der 2FA wird dringend empfohlen</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFAQOverlay = () => {
    if (!showFAQ) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Häufig gestellte Fragen</h2>
              <button
                onClick={() => setShowFAQ(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSupportOverlay = () => {
    if (!showSupport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-lg w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Support kontaktieren</h2>
              <button
                onClick={() => setShowSupport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wir helfen Ihnen gerne!</h3>
              <p className="text-gray-600 mb-6">Bei Fragen oder Problemen während der Registrierung stehen wir Ihnen zur Verfügung.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Phone className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Telefon-Support</h4>
                  <p className="text-sm text-gray-600">0211 - 837 1234</p>
                  <p className="text-xs text-gray-500">Mo-Fr: 8:00 - 17:00 Uhr</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <Mail className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">E-Mail-Support</h4>
                  <p className="text-sm text-gray-600">support@nrw.id</p>
                  <p className="text-xs text-gray-500">Antwort innerhalb von 24 Stunden</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <MessageCircle className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Live-Chat</h4>
                  <p className="text-sm text-gray-600">Sofortige Hilfe verfügbar</p>
                  <p className="text-xs text-gray-500">Mo-Fr: 9:00 - 16:00 Uhr</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Live-Chat starten
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* NRW Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg mr-4">
                NRW
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Land Nordrhein-Westfalen</h1>
                <p className="text-sm text-gray-600">Ministerium für Schule und Bildung</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <HelpCircle className="h-5 w-5 mr-1" />
                Hilfe
              </button>
              <button
                onClick={() => setShowFAQ(true)}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                FAQ
              </button>
              <button
                onClick={() => setShowSupport(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Phone className="h-5 w-5 mr-1" />
                Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Help, FAQ, Support Overlays */}
      {renderHelpOverlay()}
      {renderFAQOverlay()}
      {renderSupportOverlay()}
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Schulleitung Onboarding
          </h1>
          <p className="text-gray-600">
            Willkommen! Wir führen Sie durch die Einrichtung Ihres Accounts.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isCurrent ? 'bg-blue-500 border-blue-500 text-white' :
                    'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <StepIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="text-xs text-center max-w-20">
                    <div className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      Schritt {index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {currentStep < steps.length && (
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Zurück
            </button>

            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Abschließen' : 'Weiter'}
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingAssistant;