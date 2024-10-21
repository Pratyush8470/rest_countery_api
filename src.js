const Search = document.getElementById('search');
const Result = document.getElementById('results');

const search = async () => {
    const query = Search.value.trim();
    console.log('Search query:', query); 

    if (query === '') {
        Result.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
        console.log('API response status:', response.status);

        if (!response.ok) {
            throw new Error('No countries found');
        }

        const countries = await response.json();
        console.log('Countries data:', countries);

        if (!countries || countries.length === 0) {
            Result.innerHTML = `<p>No countries found</p>`;
            return;
        }

        display(countries); 
    } catch (error) {
        console.error('Error occurred:', error);
        Result.innerHTML = `<p>${error.message}</p>`;
    }
};

Search.addEventListener('input', search);

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        console.log('All countries data:', data); 

        const countryFlags = data.map(country => ({
            name: country.name.common,
            flag: country.flags.svg,
            capital: country.capital ? country.capital[0] : 'No capital',
            population: country.population,
            languages: country.languages ? Object.values(country.languages).join(', ') : 'No languages',
            currencies: country.currencies ? Object.values(country.currencies).map(currency => currency.name).join(', ') : 'No currency',
        }));

        display(countryFlags); 
    })
    .catch(error => console.error('Error fetching all countries:', error));

const display = (countries) => {
    if (!countries || countries.length === 0) {
        Result.innerHTML = '<p>No countries to display</p>';
        return;
    }

    Result.innerHTML = countries.map(country => `
        <div class="card border-0 p-3 rounded-5 mb-3 me-3" style="width:355px;">
            <div class="card-inner" style="--clr:#fff;">
                <div class="box">
                    <div class="imgBox">
                        <img src="${country.flag}" class="img-fluid" alt="${country.name}">
                    </div>
                    <div class="icon">
                        <a href="details.html?country=${country.name}" class="iconBox text-decoration-none"> 
                            <span class="material-symbols-outlined">arrow_outward</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="content">
                <a href="details.html?country=${country.name}" class=" text-decoration-none text-black"> 
                    <h3>${country.name}</h3>
                </a>
                <p class="m-0">Capital: ${country.capital}</p>
            </div>
        </div>
    `).join('');
};
