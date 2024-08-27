import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const SuperNicheSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedElements, setSelectedElements] = useState([]);
  const [customNiche, setCustomNiche] = useState('');
  const [superNiche, setSuperNiche] = useState('');
  const [cpl, setCpl] = useState(20);
  const [countries, setCountries] = useState([]);

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

  const popularNiches = [
    { value: 'Social Media Marketing', label: 'Social Media Marketing' },
    { value: 'Content Marketing', label: 'Content Marketing' },
    { value: 'SEO', label: 'SEO' },
    { value: 'Email Marketing', label: 'Email Marketing' },
    { value: 'Affiliate Marketing', label: 'Affiliate Marketing' },
    { value: 'Digital Photography', label: 'Digital Photography' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Graphic Design', label: 'Graphic Design' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Cryptocurrency Trading', label: 'Cryptocurrency Trading' },
    { value: 'Personal Finance', label: 'Personal Finance' },
    { value: 'Fitness and Nutrition', label: 'Fitness and Nutrition' },
    { value: 'Language Learning', label: 'Language Learning' },
    { value: 'Mindfulness and Meditation', label: 'Mindfulness and Meditation' },
    { value: 'Business Leadership', label: 'Business Leadership' },
  ];

  const calculateCPL = () => {
    let baseCPL = 20;
    let nicheFactor = 1;
    let countryFactor = 1;
    let elementCount = 0;
    let rarityFactor = 1;

    // Define rarity scores for each option
    const rarityScores = {
      Country: { USA: 1, UK: 0.9, Canada: 0.9, Australia: 0.9, Other: 0.7 },
      Language: { English: 1, Spanish: 0.9, French: 0.8, Mandarin: 0.7, Other: 0.6 },
      Religion: { Christian: 1, Muslim: 0.8, Hindu: 0.7, Buddhist: 0.7, 'No Religion': 1 },
      Profession: { Teacher: 0.9, Doctor: 0.9, Engineer: 0.9, Artist: 0.8, 'No Specific Profession': 1 },
      'Age Group': { '18-25': 1, '26-40': 1, '41-60': 0.9, '60+': 0.8 },
      Gender: { Male: 1, Female: 1 },
      Race: { White: 1, Black: 0.9, Asian: 0.9, 'No Specific': 1 },
      'Marital Status': { Single: 1, Married: 1, Divorced: 0.9 }
    };

    selectedElements.forEach(element => {
      switch(element.type) {
        case 'Country':
          if (element.option !== 'USA' && element.option !== 'Other') {
            elementCount++;
            countryFactor = rarityScores.Country[element.option] || 0.7;
          }
          break;
        case 'Language':
          if (element.option !== 'English') {
            elementCount++;
            nicheFactor *= 0.9;
            rarityFactor *= rarityScores.Language[element.option] || 0.6;
          }
          break;
        case 'Religion':
          if (element.option !== 'No Religion') {
            elementCount++;
            nicheFactor *= 0.85;
            rarityFactor *= rarityScores.Religion[element.option] || 0.7;
          }
          break;
        case 'Profession':
          if (element.option !== 'No Specific Profession') {
            elementCount++;
            nicheFactor *= 0.75;
            rarityFactor *= rarityScores.Profession[element.option] || 0.8;
          }
          break;
        case 'Age Group':
          elementCount++;
          nicheFactor *= 0.8;
          rarityFactor *= rarityScores['Age Group'][element.option] || 0.9;
          break;
        case 'Gender':
          elementCount++;
          nicheFactor *= 0.85;
          break;
        case 'Race':
          if (element.option !== 'White' && element.option !== 'No Specific') {
            elementCount++;
            nicheFactor *= 0.9;
            rarityFactor *= rarityScores.Race[element.option] || 0.9;
          }
          break;
        case 'Marital Status':
          elementCount++;
          nicheFactor *= 0.85;
          rarityFactor *= rarityScores['Marital Status'][element.option] || 0.9;
          break;
      }
    });

    // Apply niche narrowing effect
    let narrowingFactor = Math.pow(0.75, elementCount);

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

    // Apply rarity factor
    rarityFactor = Math.pow(rarityFactor, 1.5); // Amplify the effect of rarity

    let finalCPL = baseCPL * nicheFactor * countryFactor * narrowingFactor * rarityFactor;

    // Ensure CPL doesn't go below $0.5
    return Math.max(finalCPL, 0.5).toFixed(2);
  };

  useEffect(() => {
    updateSuperNiche();
    setCpl(calculateCPL());
  }, [selectedCategory, selectedElements, customNiche]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedElements([]);
  };

  const handleElementSelect = (type, option) => {
    const newElements = [...selectedElements];
    const index = newElements.findIndex(el => el.type === type);
    if (index !== -1) {
      newElements[index] = { type, option };
    } else {
      newElements.push({ type, option });
    }
    setSelectedElements(newElements);
  };

  const handleCountrySelect = (selectedOption) => {
    handleElementSelect('Country', selectedOption.value);
  };

  const handleQuickCountrySelect = (country) => {
    handleElementSelect('Country', country);
  };

  const updateSuperNiche = () => {
    if (customNiche && selectedCategory) {
      const elements = selectedElements.map(el => el.option).join(', ');
      setSuperNiche(`${customNiche} for ${elements} in the ${selectedCategory} niche`);
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
    // Fetch countries from an API
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

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img 
          src="/logo.png" 
          alt="Super Niche Selector Logo" 
          style={{ maxWidth: '600px', width: '100%', height: 'auto' }}
        />
      </div>
      <div style={{ 
        fontFamily: 'Arial, sans-serif', 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '8px', 
        boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#444' }}>Step 1: Choose a category from the Big 3</h2>
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
            <h2 style={{ color: '#444' }}>Step 2: Choose or write your niche</h2>
            <Select
              options={popularNiches}
              onChange={(selectedOption) => setCustomNiche(selectedOption ? selectedOption.value : '')}
              onInputChange={(inputValue) => setCustomNiche(inputValue)}
              value={customNiche ? { value: customNiche, label: customNiche } : null}
              placeholder="Search for a popular niche or type your own..."
              isClearable
              isSearchable
              styles={{
                control: (provided) => ({
                  ...provided,
                  marginBottom: '10px',
                }),
              }}
            />
            <input
              type="text"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="Or enter your unique niche here"
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        )}

        {selectedCategory && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: '#444' }}>Step 3: Build your super niche</h2>
            <p>Select elements to narrow down your niche:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {elements.map(({ type, options }) => (
                <div key={type} style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ marginTop: '0', color: '#333' }}>{type}</h3>
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
          <div style={{ marginBottom: '20px', backgroundColor: '#e9ecef', padding: '15px', borderRadius: '5px' }}>
            <h2 style={{ color: '#333', marginTop: '0' }}>Your Super Niche:</h2>
            <p style={{ fontSize: '18px', color: '#444' }}>{superNiche}</p>
          </div>
        )}
        
        <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '5px' }}>
          <h2 style={{ color: '#333', marginTop: '0' }}>Estimated Cost Per Lead (CPL)</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>${cpl}</p>
          <p style={{ color: '#444' }}>The more specific your niche, the lower your estimated CPL!</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Note: Selecting USA, English language, or White race doesn't reduce CPL due to high competition.</p>
        </div>
      </div>
    </div>
  );
};

export default SuperNicheSelector;