"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw, Check, Sparkles } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export default function DesignPage() {
  const { theme, refreshTheme } = useTheme();
  // Local state for form editing before saving
  const [localSettings, setLocalSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (theme) {
      setLocalSettings(JSON.parse(JSON.stringify(theme)));
    }
  }, [theme]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localSettings),
      });
      await refreshTheme(); // Apply changes globally
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset to default theme?")) return;
    
    const defaults = {
      colors: {
        primary: "#0f766e",
        secondary: "#1e293b",
        accent: "#d97706",
        background: "#f8fafc",
        surface: "#ffffff"
      },
      ui: {
        borderRadius: "0.5rem",
        buttonStyle: "rounded"
      },
      darkMode: {
        enabled: true
      }
    };
    
    setLocalSettings(defaults);
    // Don't save immediately, let user review? Or save? 
    // Usually reset implies action. Let's save.
    
    setLoading(true);
    try {
      await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaults),
      });
      await refreshTheme();
    } finally {
      setLoading(false);
    }
  };

  if (!localSettings) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <div className="flex justify-between items-center mb-lg">
        <h1>Design & Theme</h1>
        <div className="flex gap-sm">
          <button onClick={handleReset} className="btn btn-secondary" disabled={loading}>
            <RotateCcw size={18} style={{ marginRight: '0.5rem' }} /> Reset Defaults
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
            {saved ? <Check size={18} style={{ marginRight: '0.5rem' }} /> : <Save size={18} style={{ marginRight: '0.5rem' }} />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid-2">
        {/* Controls Column */}
        <div>
          {/* Colors */}
          <div className="card mb-md">
            <h2 className="mb-md">Color Palette</h2>
            <div className="form-group">
              <label>Primary Color</label>
              <div className="flex gap-sm items-center">
                <input 
                  type="color" 
                  value={localSettings.colors?.primary}
                  onChange={e => setLocalSettings({...localSettings, colors: {...localSettings.colors, primary: e.target.value}})}
                  style={{ height: '40px', width: '60px', padding: 0, border: 'none' }}
                />
                <input 
                   type="text"
                   value={localSettings.colors?.primary}
                   onChange={e => setLocalSettings({...localSettings, colors: {...localSettings.colors, primary: e.target.value}})}
                   style={{ width: '120px' }}
                />
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Used for main buttons, links, and branding.</p>
            </div>

            <div className="form-group">
              <label>Secondary Color</label>
              <div className="flex gap-sm items-center">
                <input 
                  type="color" 
                  value={localSettings.colors?.secondary}
                  onChange={e => setLocalSettings({...localSettings, colors: {...localSettings.colors, secondary: e.target.value}})}
                  style={{ height: '40px', width: '60px', padding: 0, border: 'none' }}
                />
                 <input 
                   type="text"
                   value={localSettings.colors?.secondary}
                   onChange={e => setLocalSettings({...localSettings, colors: {...localSettings.colors, secondary: e.target.value}})}
                   style={{ width: '120px' }}
                />
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Used for headers, footprint, and secondary actions.</p>
            </div>

            <div className="form-group">
              <label>Accent Color</label>
              <div className="flex gap-sm items-center">
                <input 
                  type="color" 
                  value={localSettings.colors?.accent}
                  onChange={e => setLocalSettings({...localSettings, colors: {...localSettings.colors, accent: e.target.value}})}
                  style={{ height: '40px', width: '60px', padding: 0, border: 'none' }}
                />
                 <input 
                   type="text"
                   value={localSettings.colors?.accent}
                   onChange={e => setLocalSettings({...localSettings, colors: {...localSettings.colors, accent: e.target.value}})}
                   style={{ width: '120px' }}
                />
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Used for highlights, warnings, and calls to action.</p>
            </div>
          </div>

          {/* UI Style */}
          <div className="card">
            <h2 className="mb-md">UI & Style</h2>
            <div className="form-group">
              <label>Button Style</label>
              <select 
                value={localSettings.ui?.buttonStyle || "rounded"}
                onChange={e => setLocalSettings({...localSettings, ui: {...localSettings.ui, buttonStyle: e.target.value}})}
              >
                <option value="sharp">Sharp (Square)</option>
                <option value="rounded">Rounded (Standard)</option>
                <option value="pill">Pill (Fully Rounded)</option>
              </select>
            </div>
            
             <div className="form-group">
              <label>Global Border Radius</label>
              <select 
                value={localSettings.ui?.borderRadius || "0.5rem"}
                onChange={e => setLocalSettings({...localSettings, ui: {...localSettings.ui, borderRadius: e.target.value}})}
              >
                <option value="0rem">None (0px)</option>
                <option value="0.25rem">Small (4px)</option>
                <option value="0.5rem">Medium (8px)</option>
                <option value="1rem">Large (16px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div>
          <div style={{ position: 'sticky', top: '100px' }}>
            <h2 className="mb-md">Live Preview</h2>
            <div 
              style={{ 
                padding: '2rem', 
                background: 'var(--surface-alt)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border)' 
              }}
            >
              {/* Fake Application UI applied with inline styles driven by local state to simulate preview without saving */}
              <div 
                className="card mb-md"
                style={{
                  '--primary': localSettings.colors.primary,
                  '--secondary': localSettings.colors.secondary,
                  '--accent': localSettings.colors.accent,
                  '--radius-btn': localSettings.ui.buttonStyle === 'pill' ? '9999px' : localSettings.ui.buttonStyle === 'sharp' ? '0px' : localSettings.ui.borderRadius,
                  '--radius-sm': localSettings.ui.borderRadius,
                  '--radius-md': localSettings.ui.borderRadius,
                  borderRadius: 'var(--radius-md)'
                } as any}
              >
                <h3 style={{ color: 'var(--secondary)' }}>Preview Card</h3>
                <p className="mb-md text-muted">This is how your components will look with the current settings.</p>
                
                <div className="flex gap-sm flex-wrap">
                  <button className="btn" style={{ background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-btn)' }}>
                    Primary Button
                  </button>
                  <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: 'var(--radius-btn)' }}>
                    Secondary Button
                  </button>
                </div>
              </div>

               <div 
                className="card"
                style={{
                  '--primary': localSettings.colors.primary,
                  '--secondary': localSettings.colors.secondary,
                  '--accent': localSettings.colors.accent,
                  '--radius-btn': localSettings.ui.buttonStyle === 'pill' ? '9999px' : localSettings.ui.buttonStyle === 'sharp' ? '0px' : localSettings.ui.borderRadius,
                  '--radius-sm': localSettings.ui.borderRadius,
                  '--radius-md': localSettings.ui.borderRadius,
                   background: localSettings.colors.primary,
                   color: 'white',
                   borderRadius: 'var(--radius-md)'
                } as any}
              >
                <h3 style={{ color: 'white' }}>Brand Card</h3>
                <p className="mb-md" style={{ opacity: 0.9 }}>
                  Content on top of your primary brand color.
                </p>
                 <button className="btn" style={{ background: 'white', color: 'var(--primary)', borderRadius: 'var(--radius-btn)' }}>
                   Inverted Action
                  </button>
              </div>

            </div>
            
            <p className="text-muted mt-md text-center">
              <Sparkles size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> 
              Preview updates instantly. Save to apply globally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
