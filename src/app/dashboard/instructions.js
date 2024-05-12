// instructions.js
'use client'

import { useState, useEffect } from 'react';

function Instructions() {
    const [instructions, setInstructions] = useState('Loading instructions...');

    useEffect(() => {
        fetch('/api/instructions')
            .then(response => response.json())
            .then(data => {
                if (data && data.currentInstructions) {
                    setInstructions(data.currentInstructions);
                } else {
                    setInstructions('No instructions available.');
                }
            })
            .catch(error => {
                console.error('Error fetching instructions:', error);
                setInstructions('Failed to load instructions.');
            });
    }, []);  // The empty dependency array ensures this effect runs only once on mount.

    return (
        <div>
            <h1>Instructions</h1>
            <p style={{ whiteSpace: 'pre-line' }}>{instructions}</p>
        </div>
    );
}

export default Instructions;