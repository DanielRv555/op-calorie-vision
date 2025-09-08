import React, { useState, useCallback, useEffect } from 'react';
import { identifyFoodInImage, getNutritionalInfo, initializeAiClient } from './services/geminiService';
import { getHistory, saveHistory } from './services/historyService';
import { login, getUserSession, logout } from './services/authService';
import { getGoals, saveGoals } from './services/goalService';
import { getRecipes } from './services/recipeService';
import type { NutritionData, AppState, HistoryEntry, User, GoalData, Recipe } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisView from './components/AnalysisView';
import ResultsView from './components/ResultsView';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import HistoryView from './components/HistoryView';
import GoalsView from './components/GoalsView';
import Login from './components/Login';
import RecipesView from './components/RecipesView';
import ApiKeyInput from './components/ApiKeyInput';
import SettingsView from './components/SettingsView';

const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("No se pudo leer el archivo de imagen."));
      }
      const img = new Image();
      img.src = event.target.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('No se pudo obtener el contexto del canvas.'));
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Use JPEG for photo compression, with a reasonable quality level.
        resolve(canvas.toDataURL('image/jpeg', 0.85)); 
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};


const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('GEMINI_API_KEY'));
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setAuthIsLoading] = useState(true);
  const [appState, setAppState] = useState<AppState>('idle');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [identifiedFoods, setIdentifiedFoods] = useState<string[]>([]);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryEntry | null>(null);
  const [mealDescription, setMealDescription] = useState<string>('');
  const [goals, setGoals] = useState<GoalData | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (apiKey) {
      try {
        initializeAiClient(apiKey);
        localStorage.setItem('GEMINI_API_KEY', apiKey);
      } catch (error) {
        console.error("Failed to initialize AI client:", error);
        localStorage.removeItem('GEMINI_API_KEY');
        setApiKey(null); 
        alert("La clave de API proporcionada no es válida. Por favor, inténtalo de nuevo.");
      }
    }
  }, [apiKey]);
  
  const loadRecipes = async () => {
    try {
        const fetchedRecipes = await getRecipes();
        setRecipes(fetchedRecipes);
    } catch (e) {
        console.error("Failed to load recipes", e);
    }
  };

  useEffect(() => {
    if (apiKey) {
      const session = getUserSession();
      if (session) {
        setUser(session);
        setHistory(getHistory(session.usuario));
        setGoals(getGoals(session.usuario));
        loadRecipes();
      }
      setAuthIsLoading(false);
    }
  }, [apiKey]);

  const resetState = () => {
    setAppState('idle');
    setImageFile(null);
    setImageDataUrl(null);
    setIdentifiedFoods([]);
    setNutritionInfo(null);
    setErrorMessage(null);
    setSelectedHistoryItem(null);
    setMealDescription('');
  };

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
  };

  const handleUpdateApiKey = (newKey: string) => {
    setApiKey(newKey);
    alert("Clave de API actualizada correctamente.");
    setAppState('idle');
  };

  const handleLogin = async (usuario: string, codigo: string) => {
    const loggedInUser = await login(usuario, codigo);
    setUser(loggedInUser);
    setHistory(getHistory(loggedInUser.usuario));
    setGoals(getGoals(loggedInUser.usuario));
    await loadRecipes();
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setHistory([]);
    setGoals(null);
    setRecipes([]);
    resetState();
  };
  
  const handleSaveGoals = (newGoals: GoalData) => {
    if (!user) return;
    saveGoals(user.usuario, newGoals);
    setGoals(newGoals);
    setAppState('idle');
  };

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    try {
      // For display and history, use a resized image to save space, especially on mobile.
      const resizedDataUrl = await resizeImage(file, 800, 800);
      setImageDataUrl(resizedDataUrl);
      setAppState('image_uploaded');
    } catch (error) {
      console.error("Error al redimensionar la imagen, reintentando sin redimensionar:", error);
      // Fallback to full size if resizing fails.
      const reader = new FileReader();
      reader.onload = () => {
        setImageDataUrl(reader.result as string);
        setAppState('image_uploaded');
      };
      reader.onerror = () => {
        setErrorMessage('No se pudo leer el archivo de imagen. Por favor, intenta de nuevo.');
        setAppState('error');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentifyFoods = useCallback(async () => {
    if (!imageFile) return;
    setAppState('identifying');
    setErrorMessage(null);
    try {
      const foods = await identifyFoodInImage(imageFile, mealDescription);
      setIdentifiedFoods(foods);
      setAppState('identified');
    } catch (error) {
      console.error(error);
      setErrorMessage('No se pudieron identificar los alimentos en la imagen. Por favor, intenta con otra.');
      setAppState('error');
    }
  }, [imageFile, mealDescription]);

  const handleAnalyzeNutrition = useCallback(async () => {
    if (!imageFile || !imageDataUrl || !user) return;
    setAppState('analyzing');
    setErrorMessage(null);
    try {
      const nutrition = await getNutritionalInfo(imageFile, identifiedFoods, mealDescription);
      setNutritionInfo(nutrition);

      const newHistoryEntry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        imageDataUrl: imageDataUrl,
        identifiedFoods: identifiedFoods,
        nutritionInfo: nutrition,
        mealDescription: mealDescription,
      };
      
      setHistory(currentHistory => {
        const updatedHistory = [newHistoryEntry, ...currentHistory];
        // Limit history to 100 entries to prevent storage issues
        const cappedHistory = updatedHistory.slice(0, 100);
        saveHistory(user.usuario, cappedHistory);
        return cappedHistory;
      });

      setAppState('complete');
    } catch (error) {
      console.error(error);
      setErrorMessage('No se pudo analizar la nutrición. La respuesta puede ser inválida.');
      setAppState('error');
    }
  }, [imageFile, imageDataUrl, identifiedFoods, user, mealDescription]);

  const handleShowHistory = () => {
    setAppState('viewing_history');
    setSelectedHistoryItem(null);
  };

  const handleShowGoals = () => {
    setAppState('setting_goals');
  };

  const handleShowRecipes = () => {
    setAppState('viewing_recipes');
  };

  const handleShowSettings = () => {
    setAppState('viewing_settings');
  };

  const handleDeleteHistoryEntry = (id: number) => {
    if (!user) return;
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    saveHistory(user.usuario, updatedHistory);
  };

  const renderContent = () => {
    switch (appState) {
      case 'analyzing':
        return <Loader message={'Calculando nutrición...'} />;
      case 'image_uploaded':
      case 'identifying':
      case 'identified':
        return (
          <AnalysisView
            imageDataUrl={imageDataUrl!}
            identifiedFoods={identifiedFoods}
            onIdentify={handleIdentifyFoods}
            onAnalyze={handleAnalyzeNutrition}
            isIdentifying={appState === 'identifying'}
            hasIdentified={appState === 'identified'}
            mealDescription={mealDescription}
            onDescriptionChange={setMealDescription}
          />
        );
      case 'complete':
        return (
          <ResultsView
            imageUrl={imageDataUrl!}
            nutritionInfo={nutritionInfo!}
            identifiedFoods={identifiedFoods}
            mealDescription={mealDescription}
            onReset={resetState}
          />
        );
      case 'error':
        return <ErrorDisplay message={errorMessage!} onReset={resetState} />;
      case 'setting_goals':
        return (
          <GoalsView
            initialGoals={goals}
            onSave={handleSaveGoals}
            onBack={resetState}
          />
        );
      case 'viewing_settings':
        return (
           <SettingsView
              onUpdateApiKey={handleUpdateApiKey}
              onBack={resetState}
            />
        );
      case 'viewing_recipes':
        return <RecipesView recipes={recipes} onBack={resetState} />;
      case 'viewing_history':
        if (selectedHistoryItem) {
          return (
            <ResultsView
              isHistoryView={true}
              imageUrl={selectedHistoryItem.imageDataUrl}
              nutritionInfo={selectedHistoryItem.nutritionInfo}
              identifiedFoods={selectedHistoryItem.identifiedFoods}
              mealDescription={selectedHistoryItem.mealDescription}
              onReset={() => setSelectedHistoryItem(null)}
            />
          );
        }
        return (
          <HistoryView
            history={history}
            goals={goals}
            user={user}
            onSelect={setSelectedHistoryItem}
            onBack={resetState}
            onSetGoals={handleShowGoals}
            onDelete={handleDeleteHistoryEntry}
          />
        );
      case 'idle':
      default:
        return <ImageUploader onImageUpload={handleImageUpload} />;
    }
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ApiKeyInput onSubmit={handleSetApiKey} />
      </div>
    );
  }

  if (isAuthLoading) {
    return <Loader message="Cargando..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center">
      {!user ? (
         <main className="w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8 flex-grow flex items-center">
            <Login onLogin={handleLogin} />
         </main>
      ) : (
        <>
          <Header onShowHistory={handleShowHistory} onShowGoals={handleShowGoals} onLogout={handleLogout} onShowRecipes={handleShowRecipes} onShowSettings={handleShowSettings} />
          <main className="w-full p-4 sm:p-6 lg:p-8 flex-grow">
            {renderContent()}
          </main>
          <footer className="w-full text-center p-4 text-gray-500 text-sm">
             <p>Bienvenido, {user.usuario}. Entrenador: <strong>{user.vendedor}</strong>.</p>
             <p>Tu plan vence el <strong>{user.vencimiento}</strong>. Días restantes: <strong>{user.diasRestantes}</strong>.</p>
            <p className="mt-1">&copy; {new Date().getFullYear()} Calorie Vision. Estimaciones nutricionales impulsadas por IA.</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
