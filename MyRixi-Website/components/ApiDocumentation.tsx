/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { RedocStandalone } from 'redoc';
import SwaggerParser from "@apidevtools/swagger-parser";
import '@/app/styles/redoc-overrides.css'; // Import the CSS file

interface ApiDocumentationProps {
  swaggerUrl?: string;
}

export default function ApiDocumentation({ swaggerUrl }: ApiDocumentationProps) {
  const [spec, setSpec] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Utiliser l'URL proxy locale par défaut
  const apiUrl = swaggerUrl || '/api/swagger';

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const parsedSpec = await SwaggerParser.parse(apiUrl);
        setSpec(parsedSpec);
      } catch (err) {
        console.error('Erreur lors du chargement de la spécification:', err);
        setError('Impossible de charger la documentation API. Veuillez réessayer plus tard.');
      }
    };

    fetchSpec();
  }, [apiUrl]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-neo-red neon-glow-pink mb-4">⚠️ {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="doc-button mt-4"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!spec) {
    return null; // Le composant LoadingDocs sera affiché par le parent
  }

  return (
    <RedocStandalone
      spec={spec}
      options={{
        theme: {
          colors: {
            primary: {
              main: 'hsl(157, 100%, 42%)', // --synth-green
            },
            text: {
              primary: 'hsl(0, 0%, 95%)', // --foreground
              secondary: 'hsl(0, 0%, 72%)', // --foreground-secondary
            },
            http: {
              get: 'hsl(206, 96%, 54%)',    // --techno-blue
              post: 'hsl(157, 100%, 42%)',  // --synth-green
              put: 'hsl(265, 100%, 59%)',   // --neo-purple
              options: 'hsl(166, 100%, 63%)', // --holo-turquoise
              patch: 'hsl(43, 96%, 58%)',   // --solar-gold
              delete: 'hsl(0, 100%, 65%)',  // --neo-red
              basic: 'hsl(0, 0%, 72%)',     // --foreground-secondary
              link: 'hsl(0, 0%, 95%)',  // --cyber-pink
            },
            responses: {
              success: {
                color: 'hsl(157, 100%, 42%)',  // --synth-green
                backgroundColor: 'hsla(157, 100%, 42%, 0.1)',
              },
              error: {
                color: 'hsl(0, 100%, 65%)',    // --neo-red
                backgroundColor: 'hsla(0, 100%, 65%, 0.1)',
              },
              redirect: {
                color: 'hsl(43, 96%, 58%)',    // --solar-gold
                backgroundColor: 'hsla(43, 96%, 58%, 0.1)',
              },
              info: {
                color: 'hsl(206, 96%, 54%)',   // --techno-blue
                backgroundColor: 'hsla(206, 96%, 54%, 0.1)',
              }
            },
            border: {
              dark: 'hsla(240, 7%, 17%, 0.8)',             // --divider with opacity
              light: 'hsla(240, 7%, 17%, 0.4)'             // Lighter divider
            }
          },
          typography: {
            fontSize: '16px',
            fontFamily: 'Inter, system-ui, sans-serif',
            headings: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: '600',
            },
            code: {
              fontSize: '14px',
              fontFamily: 'Fira Code, monospace',
              backgroundColor: 'hsla(240, 11%, 15%, 0.8)',
              color: 'hsl(166, 100%, 63%)',  // --holo-turquoise
            },
            links: {
              color: 'hsl(336, 100%, 65%)', // --cyber-pink
              visited: 'hsl(265, 100%, 59%)', // --neo-purple
              hover: 'hsl(157, 100%, 42%)' // --synth-green
            },
            lineHeight: '1.5em',
            optimizeSpeed: true
          },
          sidebar: {
            backgroundColor: 'hsla(228, 13%, 12%, 0.8)',  // --background2 with opacity
            textColor: 'hsl(0, 0%, 95%)',                 // --foreground
            activeTextColor: 'hsl(157, 100%, 42%)',       // --synth-green
            groupItems: {
              textTransform: 'uppercase',
              activeBackgroundColor: 'hsla(265, 100%, 59%, 0.1)' // Light --neo-purple background
            },
            level1Items: {
              textTransform: 'none'
            }
          },
          rightPanel: {
            backgroundColor: 'hsla(228, 13%, 12%, 0.9)',  // --background2 with opacity
            width: '40%',
            textColor: 'hsl(0, 0%, 95%)', // --foreground
          },
          codeBlock: {
            backgroundColor: 'hsla(270, 8%, 8%, 0.95)',   // --background1 with opacity
          },
          logo: {
            maxHeight: '100px',
            gutter: '20px'
          }
        },
        hideDownloadButton: false,
        expandResponses: "200,201",
        sortPropsAlphabetically: false,
        requiredPropsFirst: true,
        showExtensions: true,
        pathInMiddlePanel: false,
        scrollYOffset: 80, // Pour tenir compte de votre en-tête
        hideHostname: true,
        disableSearch: false,
        menuToggle: true,
        nativeScrollbars: true,
        onlyRequiredInSamples: false,
        showObjectSchemaExamples: true,
        jsonSampleExpandLevel: 3,
        hideSingleRequestSampleTab: false,
        enumSkipQuotes: false
      }}
    />
  );
}