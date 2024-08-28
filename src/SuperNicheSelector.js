import React, { useState, useEffect, useRef } from 'react';
import Select, { StylesConfig } from 'react-select';
import { Tooltip } from 'react-tooltip';
import { usePDF } from 'react-to-pdf';
import { useMediaQuery } from 'react-responsive';
import html2canvas from 'html2canvas';

const SuperNicheSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedElements, setSelectedElements] = useState([]);
  const [customNiche, setCustomNiche] = useState('');
  const [superNiche, setSuperNiche] = useState('');
  const [cpl, setCpl] = useState(15.00);
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toPDF, targetRef } = usePDF({filename: 'super-niche-selector.pdf'});
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const categories = ['Health', 'Wealth', 'Relationship'];
  const elements = [
    { type: 'Country', options: ['USA', 'UK', 'Canada', 'Australia', 'Other'] },
    { type: 'Language', options: ['English', 'Spanish', 'French', 'Mandarin', 'Other'] },
    { type: 'Religion', options: ['Christian', 'Muslim', 'Hindu', 'Buddhist', 'No Religion'] },
    { type: 'Profession', options: ['Teacher', 'Doctor', 'Engineer', 'Artist', 'Nurse', '9-5 Employee', 'Real Estate Agent', 'Entrepreneur', 'No Specific Profession'] },
    { type: 'Age Group', options: ['18-25', '26-40', '41-60', '60+'] },
    { type: 'Gender', options: ['Male', 'Female', 'No Specific'] },
    { type: 'Race', options: ['White', 'Black', 'Asian', 'No Specific'] },
    { type: 'Marital Status', options: ['Single', 'Married', 'Divorced'] },
    { type: 'Parent Type', options: ['Mom', 'Dad', 'Not a Parent'] },
    { type: 'Education Level', options: ['High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'No Specific'] },
  ];

  const topCountries = ['USA', 'UK', 'Australia', 'Canada'];

  const calculateCPL = () => {
    let baseCPL = 15.00;
    let nicheFactor = 1;
    let elementCount = 0;
    let rarityFactor = 1;

    const rarityScores = {
      Country: { USA: 1, UK: 0.9, Canada: 0.9, Australia: 0.9, Other: 0.7 },
      Language: { English: 1, Spanish: 0.9, French: 0.8, Mandarin: 0.7, Other: 0.6 },
      Religion: { Christian: 1, Muslim: 0.9, Hindu: 0.9, Buddhist: 0.9, 'No Religion': 1 },
      Profession: { Teacher: 0.9, Doctor: 0.9, Engineer: 0.9, Artist: 0.8, Nurse: 0.9, '9-5 Employee': 1, 'Real Estate Agent': 0.8, Entrepreneur: 0.7, 'No Specific Profession': 1 },
      'Age Group': { '18-25': 1, '26-40': 1, '41-60': 0.9, '60+': 0.8 },
      Gender: { Male: 1, Female: 1, 'No Specific': 1 },
      Race: { White: 1, Black: 0.9, Asian: 0.9, 'No Specific': 1 },
      'Marital Status': { Single: 1, Married: 1, Divorced: 0.9 },
      'Parent Type': { Mom: 0.9, Dad: 0.9, 'Not a Parent': 1 },
      'Education Level': { 'High School': 1, 'Associate Degree': 0.9, 'Bachelor\'s Degree': 0.8, 'Master\'s Degree': 0.7, 'Doctorate': 0.6, 'No Specific': 1 }
    };

    selectedElements.forEach(element => {
      if (element.option !== 'No Specific' && element.option !== 'No Religion' && element.option !== 'No Specific Profession' && element.option !== 'All') {
        elementCount++;
        nicheFactor *= rarityScores[element.type]?.[element.option] || 0.9;
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
      const elements = selectedElements.map(el => {
        if (el.type === 'Gender') {
          const genders = selectedElements.filter(g => g.type === 'Gender').map(g => g.option);
          return genders.length > 1 ? genders.join(' and ') : genders[0];
        }
        return el.option;
      }).join(', ');
      const newSuperNiche = `${customNiche} for ${elements} in the ${selectedCategory} niche`;
      console.log('New super niche:', newSuperNiche);
      setSuperNiche(newSuperNiche);
    } else {
      setSuperNiche('');
    }
  };

  const lightModeColors = {
    background: '#f0f2f5',  // Light grey background
    elementBackground: '#ffffff',  // White for element backgrounds
    text: '#333333',  // Dark grey for text
    border: '#d1d5db',  // Light grey for borders
  };

  const darkModeColors = {
    background: '#333333',
    elementBackground: '#444444',
    text: '#ffffff',
    border: '#666666',
  };

  const currentTheme = isDarkMode ? darkModeColors : lightModeColors;

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: currentTheme.elementBackground,
      color: currentTheme.text,
      borderColor: currentTheme.border,
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: currentTheme.elementBackground,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDarkMode ? '#666' : '#e2e8f0'
        : currentTheme.elementBackground,
      color: currentTheme.text,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: currentTheme.text,
    }),
    input: (provided, state) => ({
      ...provided,
      color: currentTheme.text,
    }),
  };

  const buttonStyle = (isSelected) => ({
    padding: '8px 12px',
    margin: '4px',
    backgroundColor: isSelected ? '#4CAF50' : currentTheme.elementBackground,
    color: isSelected ? 'white' : currentTheme.text,
    border: `1px solid ${currentTheme.border}`,
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

    // Fetch languages
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const languageSet = new Set();
        data.forEach(country => {
          if (country.languages) {
            Object.values(country.languages).forEach(lang => languageSet.add(lang));
          }
        });
        const languageOptions = Array.from(languageSet).sort().map(lang => ({
          value: lang,
          label: lang
        }));
        setLanguages(languageOptions);
      })
      .catch(error => console.error('Error fetching languages:', error));
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
    'Marital Status': 'Choose the marital status if it affects your niche',
    'Parent Type': 'Select the parent type if relevant to your niche',
    'Education Level': 'Select the education level of your target audience'
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
        src="https://raw.githubusercontent.com/pantheonmarketing/super-niche-selector/main/public/logo.png"
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
        backgroundColor: currentTheme.background,
        color: currentTheme.text,
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
          <h2 style={{ color: currentTheme.text }}>Step 1: Choose a category from the Big 3</h2>
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
            <h2 style={{ color: currentTheme.text }}>Step 2: Write your niche</h2>
            <input
              type="text"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="Enter your niche here"
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: `1px solid ${currentTheme.border}` }}
            />
          </div>
        )}

        {selectedCategory && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: currentTheme.text }}>Step 3: Build your super niche</h2>
            <p>Select elements to narrow down your niche:</p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '10px' }}>
              {elements.map(({ type, options }) => (
                <div key={type} style={{ 
                  backgroundColor: currentTheme.elementBackground, 
                  padding: '10px', 
                  borderRadius: '5px', 
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  border: `1px solid ${currentTheme.border}`,
                }}>
                  <h3 style={{ marginTop: '0', color: currentTheme.text }} data-tooltip-id={type} data-tooltip-content={tooltips[type]}>{type}</h3>
                  <Tooltip id={type} />
                  {type === 'Country' ? (
                    <Select
                      options={countries}
                      onChange={(selectedOption) => handleElementSelect('Country', selectedOption.value)}
                      placeholder="Select a country..."
                      styles={customSelectStyles}
                    />
                  ) : type === 'Language' ? (
                    <Select
                      options={languages}
                      onChange={(selectedOption) => handleElementSelect('Language', selectedOption.value)}
                      placeholder="Select a language..."
                      styles={customSelectStyles}
                    />
                  ) : type === 'Gender' ? (
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
          <div style={{ marginBottom: '20px', backgroundColor: currentTheme.elementBackground, padding: '15px', borderRadius: '5px' }}>
            <h2 style={{ color: currentTheme.text, marginTop: '0' }}>Your Super Niche:</h2>
            <p style={{ fontSize: '18px', color: currentTheme.text }}>{superNiche}</p>
          </div>
        )}
        
        <div style={{ backgroundColor: currentTheme.elementBackground, padding: '15px', borderRadius: '5px' }}>
          <h2 style={{ color: currentTheme.text, marginTop: '0' }}>Estimated Cost Per Lead (CPL)</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: currentTheme.text }}>${cpl}</p>
          <p style={{ color: currentTheme.text }}>The more specific your niche, the lower your estimated CPL!</p>
          <p style={{ color: currentTheme.text, fontSize: '14px' }}>Note: Selecting USA, English language, or White race doesn't reduce CPL due to high competition.</p>
        </div>
      </div>
    </div>
  );
};

export default SuperNicheSelector;