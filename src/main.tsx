import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './app.tsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {worker} from './mock-server/browser';

const queryClient = new QueryClient();

worker.start().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App/>
      </QueryClientProvider>
    </React.StrictMode>
  );
})
