let votes = {};
        let candidates = {};
        let voters = {};
        let hasVoted = {};
        let authorityLoggedIn = false; // Track authority login status
        let otpStorage = {}; // Store OTPs for each voter

        // Generate random OTP (for demo purposes)
        function generateOTP() {
            return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
        }

        function registerCandidate() {
            const candidateName = document.getElementById('candidateName').value;
            const candidateAge = parseInt(document.getElementById('candidateAge').value);
            const candidateDOB = document.getElementById('candidateDOB').value;

            const birthDate = new Date(candidateDOB);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const isAdult = age > 18 || (age === 18 && monthDiff >= 0);

            if (candidateName && candidateAge && isAdult) {
                if (candidateAge === age) {  // Ensure that the provided age matches the date of birth
                    if (!votes[candidateName]) {
                        votes[candidateName] = 0; // Initialize vote count for candidate
                        candidates[candidateName] = candidateDOB; // Store candidate info
                        const candidateList = document.getElementById('candidateList');
                        const button = document.createElement('button');
                        button.className = 'vote-button';
                        button.innerText = candidateName;
                        button.onclick = () => vote(candidateName);
                        candidateList.appendChild(button);

                        // Clear the input fields
                        document.getElementById('candidateName').value = '';
                        document.getElementById('candidateAge').value = '';
                        document.getElementById('candidateDOB').value = '';
                    } else {
                        alert('Candidate already registered!');
                    }
                } else {
                    alert('The age provided does not match the date of birth.');
                }
            } else if (candidateAge < 18) {
                alert('Candidate must be at least 18 years old.');
            } else {
                alert('Please fill in all fields.');
            }
        }

        function registerVoter() {
            const voterName = document.getElementById('voterName').value;
            const voterAge = parseInt(document.getElementById('voterAge').value);
            const voterDOB = document.getElementById('voterDOB').value;

            const birthDate = new Date(voterDOB);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const isAdult = age > 18 || (age === 18 && monthDiff >= 0);
            const formattedDOB = voterDOB.split('-').reverse().join('').replace(/-/g, ''); // Convert to DDMMYYYY

            if (voterName && voterAge && isAdult) {
                if (voterAge === age) {  // Ensure that the provided age matches the date of birth
                    if (!voters[voterName]) {
                        voters[voterName] = formattedDOB; // Store voter info
                        alert('Voter registered successfully! You can now log in.');
                        document.getElementById('voterName').value = '';
                        document.getElementById('voterAge').value = '';
                        document.getElementById('voterDOB').value = '';
                        document.getElementById('loginSection').classList.remove('hidden');
                    } else {
                        alert('Username already exists.Please choose another');
                    }
                } else {
                    alert('The age provided does not match the date of birth.');
                }
            } else if (voterAge < 18) {
                alert('You must be at least 18 years old to register.');
            } else {
                alert('Please fill in all fields.');
            }
        }

        function login() {
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            if (hasVoted[username]) {
                alert('You have already voted.');
                return; // Prevent login if the user has already voted
            }

            if (voters[username] && voters[username] === password) {
                alert('Login successful!');

                // Generate and store unique OTP for the voter
                otpStorage[username] = generateOTP();
                document.getElementById('otpDisplay').innerText = otpStorage[username];

                // Clear the OTP input field before showing the modal
                document.getElementById('otpInput').value = '';

                // Show OTP Modal
                document.getElementById('otpModal').style.display = 'flex';
            } else {
                alert('Invalid username or password.');
            }
        }

        function verifyOTP() {
            const enteredOTP = document.getElementById('otpInput').value;
            const username = document.getElementById('loginUsername').value;

            if (enteredOTP == otpStorage[username]) {
                alert('OTP verified successfully!');
                document.getElementById('otpModal').style.display = 'none';
                document.getElementById('votingSection').classList.remove('hidden');
                document.getElementById('loginSection').classList.add('hidden');
                hasVoted[username] = false; // Reset vote status
            } else {
                alert('Invalid OTP. Please try again.');
            }
        }

        function closeOTPModal() {
            document.getElementById('otpModal').style.display = 'none';
        }

        function vote(candidate) {
            const username = document.getElementById('loginUsername').value;

            if (!hasVoted[username]) {
                votes[candidate]++; // Increment vote count
                hasVoted[username] = true; // Mark the user as voted
                alert(`You voted for ${candidate}`);
                updateResults();

                // Hide voting options and log out user after voting
                document.getElementById('votingSection').classList.add('hidden');
                document.getElementById('loginSection').classList.remove('hidden');

                // Optionally clear the username and password fields for a complete logout experience
                document.getElementById('loginUsername').value = '';
                document.getElementById('loginPassword').value = '';
            } else {
                alert('You have already voted.');
            }
        }

        function loginAuthority() {
            const username = document.getElementById('authorityUsername').value;
            const password = document.getElementById('authorityPassword').value;

            if (username === 'authority' && password === 'ecresults') {
                alert('Authority login successful!');
                authorityLoggedIn = true;

                // Hide registration sections
                document.getElementById('loginSection').classList.add('hidden');
                document.getElementById('voterRegistration').classList.add('hidden');
                document.getElementById('candidateRegistration').classList.add('hidden');
                document.getElementById('showAuthorityLoginButton').classList.add('hidden');
                
                // Show Publish Results button
                document.getElementById('publishResultsButton').classList.remove('hidden');

                // Show results and voter list
                showResults();
                showVoterList();
            } else {
                alert('Invalid authority username or password.');
            }
        }

        function showVoterList() {
            const voterListAnnouncement = document.getElementById('voterListAnnouncement');
            voterListAnnouncement.innerHTML = '<h3>Registered Voters:</h3>';
            
            for (const voter in voters) {
                const voterItem = document.createElement('p');
                voterItem.innerText = voter; // Display registered voter names
                voterListAnnouncement.appendChild(voterItem);
            }

            voterListAnnouncement.classList.remove('hidden');
            voterListAnnouncement.style.display = 'block'; // Ensure visibility
        }

        function publishResults() {
            // Hide all registration and voting-related sections
            document.getElementById('candidateRegistration').classList.add('hidden');
            document.getElementById('voterRegistration').classList.add('hidden');
            document.getElementById('votingSection').classList.add('hidden');
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('authorityLoginSection').classList.add('hidden');

            // Show results to the public
            showResults(); // Call to show results publicly
        }

        function logoutAuthority() {
            alert('Logged out successfully!');
            authorityLoggedIn = false;

            // Hide results and logout button
            const resultsSection = document.getElementById('results');
            resultsSection.style.display = 'none';
            document.getElementById('publishResultsButton').classList.add('hidden');

            // Show home page sections again
            document.getElementById('candidateRegistration').classList.remove('hidden');
            document.getElementById('voterRegistration').classList.remove('hidden');
            document.getElementById('showAuthorityLoginButton').classList.remove('hidden');

            // Clear the results and voter list once authority logs out
            document.getElementById("resultsList").innerHTML = '';
            document.getElementById("winnerAnnouncement").innerText = '';
            document.getElementById("voterListAnnouncement").innerHTML = '';
        }

        function toggleAuthorityLogin() {
            const authorityLoginSection = document.getElementById('authorityLoginSection');
            authorityLoginSection.classList.toggle('hidden');
            // Hide all other sections as soon as the Authority login button is clicked
            document.getElementById('candidateRegistration').classList.add('hidden');
            document.getElementById('voterRegistration').classList.add('hidden');
            document.getElementById('votingSection').classList.add('hidden');
            document.getElementById('loginSection').classList.add('hidden');
        }

        function showResults() {
            const resultsList = document.getElementById('resultsList');
            resultsList.innerHTML = ''; // Clear previous results
            let totalVotes = 0;

            // Display candidate names and vote counts
            const candidateResults = document.createElement('div');
            candidateResults.innerHTML = '<h3>Candidate Results</h3>';
            for (const candidate in votes) {
                totalVotes += votes[candidate];
                const resultItem = document.createElement('p');
                resultItem.innerText = `${candidate}: ${votes[candidate]} votes`;
                candidateResults.appendChild(resultItem);
            }

            // Determine the winner
            const winner = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
            const winnerCount = votes[winner];
            let winnerAnnouncementText = '';

            if (totalVotes > 0 && winnerCount > totalVotes / 2) {
                winnerAnnouncementText = `Winner: ${winner} with ${winnerCount} votes!`;
            } else {
                winnerAnnouncementText = `No clear winner.`;
            }

            // Append the results to the results section
            resultsList.appendChild(candidateResults);
            document.getElementById('winnerAnnouncement').innerText = winnerAnnouncementText;

            // Make the results visible
            document.getElementById('results').style.display = 'block';
        }

        function updateResults() {
            if (authorityLoggedIn) {
                showResults();
            }
        }