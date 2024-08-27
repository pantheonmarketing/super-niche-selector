import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';
import { usePDF } from 'react-to-pdf';
import { useMediaQuery } from 'react-responsive';
import html2canvas from 'html2canvas';

const SuperNicheSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedElements, setSelectedElements] = useState([]);
  const [customNiche, setCustomNiche] = useState('');
  const [superNiche, setSuperNiche] = useState('');
  const [cpl, setCpl] = useState(15.01);
  const [countries, setCountries] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toPDF, targetRef } = usePDF({filename: 'super-niche-selector.pdf'});
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const categories = ['Health', 'Wealth', 'Relationship'];
  const elements = [
    { type: 'Country', options: ['USA', 'UK', 'Canada', 'Australia', 'Other'] },
    { type: 'Language', options: ['English', 'Spanish', 'French', 'Mandarin', 'Other'] },
    { type: 'Religion', options: ['Christian', 'Muslim', 'Hindu', 'Buddhist', 'No Religion'] },
    { type: 'Profession', options: ['Teacher', 'Doctor', 'Engineer', 'Artist', 'No Specific Profession'] },
    { type: 'Age Group', options: ['18-25', '26-40', '41-60', '60+'] },
    { type: 'Gender', options: ['Male', 'Female'] },
    { type: 'Race', options: ['White', 'Black', 'Asian', 'No Specific'] },
    { type: 'Marital Status', options: ['Single', 'Married', 'Divorced'] },
  ];

  const topCountries = ['USA', 'UK', 'Australia', 'Canada'];

  const calculateCPL = () => {
    let baseCPL = 15.01;
    let nicheFactor = 1;
    let elementCount = 0;
    let rarityFactor = 1;

    const rarityScores = {
      Country: { USA: 1, UK: 0.9, Canada: 0.9, Australia: 0.9, Other: 0.7 },
      Language: { English: 1, Spanish: 0.9, French: 0.8, Mandarin: 0.7, Other: 0.6 },
      Religion: { Christian: 1, Muslim: 0.9, Hindu: 0.9, Buddhist: 0.9, 'No Religion': 1 },
      Profession: { Teacher: 0.9, Doctor: 0.9, Engineer: 0.9, Artist: 0.8, 'No Specific Profession': 1 },
      'Age Group': { '18-25': 1, '26-40': 1, '41-60': 0.9, '60+': 0.8 },
      Gender: { Male: 1, Female: 1, 'No Specific': 1 },
      Race: { White: 1, Black: 0.9, Asian: 0.9, 'No Specific': 1 },
      'Marital Status': { Single: 1, Married: 1, Divorced: 0.9 }
    };

    selectedElements.forEach(element => {
      if (element.option !== 'No Specific' && element.option !== 'No Religion' && element.option !== 'No Specific Profession') {
        elementCount++;
        nicheFactor *= rarityScores[element.type][element.option] || 0.9;
      }
    });

    // Apply niche narrowing effect
    let narrowingFactor = Math.pow(0.7, elementCount);

    // Apply category-specific adjustments
    switch(selectedCategory) {
      case 'Wealth':
        baseCPL *= 1.3;
        break;
      case 'Health':
        baseCPL *= 1.2;
        break;
      case 'Relationship':
        baseCPL *= 1.1;
        break;
    }

    let finalCPL = baseCPL * nicheFactor * narrowingFactor;

    // Ensure CPL doesn't go below $0.5
    return Math.max(finalCPL, 0.5).toFixed(2);
  };

  useEffect(() => {
    console.log('Effect triggered. Current state:', { selectedCategory, customNiche, selectedElements });
    if (selectedCategory && customNiche) {
      updateSuperNiche();
    }
    setCpl(calculateCPL());
  }, [selectedCategory, selectedElements, customNiche]);

  const handleCategorySelect = (category) => {
    console.log('Category selected:', category);
    setSelectedCategory(category);
    setSelectedElements([]);
  };

  const handleElementSelect = (type, option) => {
    console.log('Element selected:', { type, option });
    setSelectedElements(prevElements => {
      const newElements = prevElements.filter(el => el.type !== type);
      newElements.push({ type, option });
      console.log('New selected elements:', newElements);
      return newElements;
    });
  };

  const handleCountrySelect = (selectedOption) => {
    console.log('Country selected:', selectedOption);
    handleElementSelect('Country', selectedOption.value);
  };

  const handleQuickCountrySelect = (country) => {
    console.log('Quick country selected:', country);
    handleElementSelect('Country', country);
  };

  const updateSuperNiche = () => {
    console.log('Updating super niche');
    if (customNiche && selectedCategory) {
      const elements = selectedElements.map(el => el.option).join(', ');
      const newSuperNiche = `${customNiche} for ${elements} in the ${selectedCategory} niche`;
      console.log('New super niche:', newSuperNiche);
      setSuperNiche(newSuperNiche);
    } else {
      setSuperNiche('');
    }
  };

  const buttonStyle = (isSelected) => ({
    padding: '8px 12px',
    margin: '4px',
    backgroundColor: isSelected ? '#4CAF50' : '#f0f0f0',
    color: isSelected ? 'white' : 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  });

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const countryOptions = data.map(country => ({
          value: country.name.common,
          label: country.name.common
        }));
        setCountries(countryOptions);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const tooltips = {
    'Country': 'Select the target country for your niche',
    'Language': 'Choose the primary language of your target audience',
    'Religion': 'Select the religious background if relevant to your niche',
    'Profession': 'Choose the professional background of your target audience',
    'Age Group': 'Select the age range of your target audience',
    'Gender': 'Choose the gender if it is specific to your niche',
    'Race': 'Select the racial background if relevant to your niche',
    'Marital Status': 'Choose the marital status if it affects your niche'
  };

  const darkModeStyles = {
    backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
    color: isDarkMode ? '#fff' : '#333',
  };

  const exportToPNG = () => {
    html2canvas(targetRef.current).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'super-niche-selector.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div style={{ 
      backgroundColor: '#020101', // Always dark black
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px'
    }}>
      <img 
        src="/logo.png" 
        alt="Super Niche Selector Logo" 
        style={{ maxWidth: '600px', width: '100%', height: 'auto', marginBottom: '40px' }}
      />
      <div ref={targetRef} style={{ 
        fontFamily: 'Arial, sans-serif', 
        maxWidth: '800px', 
        width: '100%',
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
        color: isDarkMode ? '#fff' : '#333',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button onClick={toggleDarkMode} style={{ padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <div>
            <button onClick={() => toPDF()} style={{ padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
              Export to PDF
            </button>
            <button onClick={exportToPNG} style={{ padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
              Export to PNG
            </button>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: isDarkMode ? '#fff' : '#444' }}>Step 1: Choose a category from the Big 3</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                style={buttonStyle(selectedCategory === category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {selectedCategory && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: isDarkMode ? '#fff' : '#444' }}>Step 2: Write your niche</h2>
            <input
              type="text"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="Enter your niche here"
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        )}

        {selectedCategory && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: isDarkMode ? '#fff' : '#444' }}>Step 3: Build your super niche</h2>
            <p>Select elements to narrow down your niche:</p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '10px' }}>
              {elements.map(({ type, options }) => (
                <div key={type} style={{ backgroundColor: isDarkMode ? '#444' : '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ marginTop: '0', color: isDarkMode ? '#fff' : '#333' }} data-tooltip-id={type} data-tooltip-content={tooltips[type]}>{type}</h3>
                  <Tooltip id={type} />
                  {type === 'Country' ? (
                    <div>
                      <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {topCountries.map(country => (
                          <button
                            key={country}
                            onClick={() => handleQuickCountrySelect(country)}
                            style={buttonStyle(selectedElements.some(el => el.type === 'Country' && el.option === country))}
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                      <Select
                        options={countries}
                        onChange={handleCountrySelect}
                        placeholder="Search for other countries..."
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {options.map(option => (
                        <button
                          key={option}
                          onClick={() => handleElementSelect(type, option)}
                          style={buttonStyle(selectedElements.some(el => el.type === type && el.option === option))}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {superNiche && (
          <div style={{ marginBottom: '20px', backgroundColor: isDarkMode ? '#444' : '#e9ecef', padding: '15px', borderRadius: '5px' }}>
            <h2 style={{ color: isDarkMode ? '#fff' : '#333', marginTop: '0' }}>Your Super Niche:</h2>
            <p style={{ fontSize: '18px', color: isDarkMode ? '#fff' : '#444' }}>{superNiche}</p>
          </div>
        )}
        
        <div style={{ backgroundColor: isDarkMode ? '#444' : '#d4edda', padding: '15px', borderRadius: '5px' }}>
          <h2 style={{ color: isDarkMode ? '#fff' : '#333', marginTop: '0' }}>Estimated Cost Per Lead (CPL)</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: isDarkMode ? '#fff' : '#28a745' }}>${cpl}</p>
          <p style={{ color: isDarkMode ? '#fff' : '#444' }}>The more specific your niche, the lower your estimated CPL!</p>
          <p style={{ color: isDarkMode ? '#fff' : '#666', fontSize: '14px' }}>Note: Selecting USA, English language, or White race doesn't reduce CPL due to high competition.</p>
        </div>
      </div>
    </div>
  );
};

export default SuperNicheSelector;