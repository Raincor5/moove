import Header from './Header';
import MapComponent from './MapComponent';
import Footer from './Footer';
import './App.scss';

function App() {
  return (
    <div className='App'>
      <Header />
      <main className='content'>
        <MapComponent />
      </main>
      <Footer />
      {/* Rest of the content */}
    </div>
  );
}

export default App;
