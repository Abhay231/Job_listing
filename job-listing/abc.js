const apiUrl = 'https://api.recruitcrm.io/v1/jobs/search';
const apiToken = '7ph7atKWpBgK5rQQDbd1alptL2UiQ1vusYTB8hb8B6UP7bLKmb2qt3HRjScQa9nunJuI5cdhpqU0kyVrzHm5TF8xNjk3MDMyNDU2';

const countries = ["denmark","mexico","france"]

const jobProfiles= ["Art Director","Backend Developer","Chef","Frontend Developer","Event Coordinator","Sales Analytics Director","Head of Digital Marketing","Logistics Manager","VP of Client Relations","DevOps Engineer","Tax Consultant","SaaS Product Manager","SaaS Sales Associate","VP of IT","Environmental Specialist","Welder","Research Scientist","Digital Marketer","Account Manager","Director of Technical Support"];

    function search() {
        let selectedJob = ""
        let selectedCountry=""
        selectedJob = document.getElementById('job-search').value;
        selectedCountry = document.getElementById('choose-country').value;
        const selectedKeyword = document.getElementById('keywordInput').value;

        if(selectedCountry=="" && countries.includes(selectedKeyword))  selectedCountry=selectedKeyword
        if(selectedJob=="" && jobProfiles.includes(selectedKeyword))  selectedJob=selectedKeyword

        const searchData = {
           
            country: selectedCountry,
            job:selectedJob
        };
        setTimeout(() => {
            fetchFilteredData(searchData);
        }, 2000);

        
    }
    const jobsPerPage = 3;
    let currentPage = 1;
    const staticJobs = [

        { name: 'Web Developer' ,city: 'New York', shared_job_image: 'https://t4.ftcdn.net/jpg/01/33/48/03/360_F_133480376_PWlsZ1Bdr2SVnTRpb8jCtY59CyEBdoUt.jpg', job_type: ' ABC Tech' },
        { name: 'Graphic Designer' ,city: 'Los Angeles', shared_job_image: 'https://www.aabhishek.com/wp-content/uploads/2020/01/Visa-Company-Logo-Oci-Visa-Center-Logo-Logo-Design-company-USA-London-India-Dubai.jpg', job_type: ' ABC Tech' },
        { name: 'Project Manager' ,city: 'Chicago', shared_job_image: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/business-logo-design-template-78655edda18bc1196ab28760f1535baa_screen.jpg?ts=1617645324', job_type: ' ABC Tech' },
        { name: 'Data Analyst' ,city: 'San Francisco', shared_job_image: 'https://cdn4.vectorstock.com/i/1000x1000/31/38/building-business-company-logo-vector-19953138.jpg', job_type: ' ABC Tech' },
        { name: 'Software Engineer' ,city: 'Austin', shared_job_image: 'https://img.freepik.com/free-vector/abstract-company-logo_53876-120501.jpg', job_type: ' ABC Tech' },
        { name: 'Marketing Specialist' ,city: 'Seattle', shared_job_image: 'https://img.freepik.com/free-vector/abstract-company-logo_53876-120501.jpg', job_type: ' ABC Tech' },
        { name: 'Sales executive' ,city: 'Delhi', shared_job_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Bain_and_Company_Logo_1.svg/1024px-Bain_and_Company_Logo_1.svg.png', job_type: ' ABC Tech' },
        { name: 'Customer Support' ,city: 'Austria', shared_job_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Mediterranean_Shipping_Company_logo.svg/2317px-Mediterranean_Shipping_Company_logo.svg.png', job_type: ' ABC Tech' },
        { name: 'Finance and Accounting' ,city: 'Banglore', shared_job_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB-yH6n4aUt0SuB9ZVZKjlxDb8sHTofwiHnA&usqp=CAU', job_type: ' ABC Tech' },

        
    ];

    function toggleMobileMenu() {
        var navbar = document.getElementById("navbar");
        navbar.classList.toggle("nav-active");
    }

    const loadingSpinner = document.getElementById('loadingSpinner');
    function showLoadingSpinner() {
        loadingSpinner.style.display = 'block';
    }

    function hideLoadingSpinner() {
        loadingSpinner.style.display = 'none';
    }
    async function fetchFilteredData(searchData) {
        const {country,job} =searchData
        if (!country && !job) {
            renderJobCards(staticJobs,currentPage); 
            return;
        }

        const apiEndpoint = `${apiUrl}?country=${country}&name=${job}`;

        showLoadingSpinner();

        try {
            const response = await fetch(apiEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + apiToken,
                    'Content-Type': 'application/json'
                },
            });
            console.log(response)
            const data = await response.json();
            console.log(data);

            if (data && data.data) {
                renderJobCards(data.data,currentPage);
                renderPagination(data.data.length);
            } 
            else{

                const jobContainer = document.querySelector('.job-openings');
                jobContainer.innerHTML = '<h2>NO JOB FOUND</h2>';
                const paginationContainer = document.getElementById('pagination');
                paginationContainer.innerHTML = '';
            }
            
        } catch (error) {

            console.error('Error fetching filtered data:', error);
        }
        finally 
        {
            
            hideLoadingSpinner();
        }
    }

    fetchFilteredData({
        "custom_fields": [
          {
            "field_id": 1,
            "filter_type": "equals",
            "filter_value": "search value"
          }
        ]
    })

    function renderPagination(totalJobs) {
        const totalPages = Math.ceil(totalJobs / jobsPerPage);
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';
    
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                search();
            }
        });
    
        paginationContainer.appendChild(prevButton);
    
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                search();
            });
    
            paginationContainer.appendChild(pageButton);
        }
    
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';

        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                search();
            }
        });
    
        paginationContainer.appendChild(nextButton);
    }
    
      function renderJobCards(jobs,page) {

        const jobContainer = document.querySelector('.job-openings');
        jobContainer.innerHTML = '';
        const startIndex = (page - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        const currentJobs = jobs.slice(startIndex, endIndex);
        console.log(currentJobs);
        currentJobs.forEach(job => {

            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card');
            jobCard.innerHTML = `
                <img src="${job.shared_job_image}" alt="${job.job_type} Icon">
                <h2>${job.name}</h2>
                <p>Location: ${job.city}</p>
                
                <button class="apply-button" onclick="showModal('${job.name}', '${job.city}')">Apply</button>
            `;

            jobContainer.appendChild(jobCard);
        });
    }

    function showModal() {
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';
      
        
        window.onclick = function(event) {
          if (event.target === modal) {
            modal.style.display = 'none';
          }
        };
      
        
        const closeButton = document.querySelector('.close');
        closeButton.onclick = function() {
          modal.style.display = 'none';
        };
    }

      
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', search);