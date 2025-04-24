import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.myrixi.com/swagger/v1/swagger.json', {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Mettre en cache pendant 1 heure
    });

    if (!response.ok) {
      throw new Error(`Erreur de récupération: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération du swagger:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer la documentation API' },
      { status: 500 }
    );
  }
}