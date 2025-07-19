// Quiz Application State
class QuizApp {
    constructor() {
        this.currentScreen = 'welcome';
        this.selectedCaseStudies = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.score = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        
        // Case studies from the Excel file
        this.caseStudies = [
            { id: 1, title: "NIST Framework Adoption", description: "Understanding NIST Cybersecurity Framework implementation" },
            { id: 2, title: "SolarWinds Supply Chain Attack (2020)", description: "Analysis of supply chain security vulnerabilities" },
            { id: 3, title: "Heartbleed Vulnerability (2014)", description: "OpenSSL vulnerability and its impact" },
            { id: 4, title: "Target Data Breach (2013)", description: "Point-of-sale system security breach" },
            { id: 5, title: "WannaCry Ransomware (2017)", description: "Global ransomware attack analysis" },
            { id: 6, title: "Twitter Hack (2020)", description: "Social engineering and account compromise" },
            { id: 7, title: "Capital One Data Breach (2019)", description: "Cloud misconfiguration and data exposure" },
            { id: 8, title: "Mirai Botnet Attack (2016)", description: "IoT device security and botnet attacks" },
            { id: 9, title: "Google's BeyondCorp Initiative", description: "Zero-trust security architecture" },
            { id: 10, title: "WhatsApp Vulnerability (2019)", description: "End-to-end encryption and messaging security" },
            { id: 11, title: "Maersk NotPetya Attack (2017)", description: "Nation-state cyber warfare and business impact" },
            { id: 12, title: "Facebook-Cambridge Analytica Scandal", description: "Data privacy and third-party access" },
            { id: 13, title: "AI in Detecting Phishing Attacks", description: "Machine learning in cybersecurity" },
            { id: 14, title: "Equifax Data Breach (2017)", description: "Massive data breach affecting millions of consumers" },
            { id: 15, title: "SQL Injection on Sony Pictures (2011)", description: "Database security breach through SQL injection attack" }
        ];
        
        // Sample questions for each case study (you can add more)
        this.questions = {
            1: [ // NIST Framework Adoption
                {
                    question: "What are the five core functions of the NIST Cybersecurity Framework?",
                    options: [
                        "Monitor, Analyze, Block, Encrypt, Report",
                        "Identify, Protect, Detect, Respond, Recover",
                        "Plan, Build, Deploy, Test, Secure",
                        "Predict, Prevent, Detect, Investigate, Repair"
                    ],
                    correct: 1
                },
                {
                    question: "The NIST Cybersecurity Framework was primarily designed for which sector?",
                    options: [
                        "Healthcare",
                        "Education",
                        "Critical Infrastructure",
                        "E-commerce"
                    ],
                    correct: 2
                },
                {
                    question: "What is the purpose of a 'Profile' in the NIST CSF?",
                    options: [
                        "To define user credentials",
                        "To map current and target cybersecurity postures",
                        "To identify malware infections",
                        "To implement encryption strategies"
                    ],
                    correct: 1
                },
                {
                    question: "What does Tier 4 (Adaptive) represent in the NIST CSF tiers?",
                    options: [
                        "The organization is unaware of risks",
                        "The organization proactively adapts to changing threats",
                        "The organization has no formal security policy",
                        "The organization depends solely on third parties"
                    ],
                    correct: 1
                },
                {
                    question: "Which of the following is NOT a core NIST CSF function?",
                    options: [
                        "Identify",
                        "Respond",
                        "Encrypt",
                        "Protect"
                    ],
                    correct: 2
                },
                {
                    question: "What kind of approach does NIST CSF encourage organizations to adopt?",
                    options: [
                        "Static and technology-specific",
                        "Risk-based and adaptive",
                        "Compliance-only driven",
                        "Audit-only focused"
                    ],
                    correct: 1
                },
                {
                    question: "Which function of the NIST CSF includes asset management and risk assessment?",
                    options: [
                        "Protect",
                        "Detect",
                        "Identify",
                        "Recover"
                    ],
                    correct: 2
                },
                {
                    question: "A bank adopts NIST CSF to improve its incident response plan. Which function does this relate to?",
                    options: [
                        "Identify",
                        "Respond",
                        "Protect",
                        "Recover"
                    ],
                    correct: 1
                },
                {
                    question: "What is the benefit of NIST CSF adoption for an organization's security architecture?",
                    options: [
                        "It enforces government compliance.",
                        "It aligns cybersecurity with business objectives.",
                        "It eliminates the need for firewalls.",
                        "It replaces all existing frameworks."
                    ],
                    correct: 1
                },
                {
                    question: "In a mature organization at Tier 3, which behavior is expected?",
                    options: [
                        "No formal cybersecurity practices",
                        "Ad hoc incident responses",
                        "Cybersecurity practices are repeatable and documented",
                        "Cybersecurity is ignored unless audited"
                    ],
                    correct: 2
                }
            ],
            2: [ // SolarWinds Supply Chain Attack
                {
                    question: "What was the name of the trojanized update in the SolarWinds attack?",
                    options: [
                        "FLAME",
                        "SHADOWHAMMER",
                        "SUNBURST",
                        "GHOSTNET"
                    ],
                    correct: 2
                },
                {
                    question: "What type of cyberattack was the SolarWinds incident classified as?",
                    options: [
                        "Phishing attack",
                        "Supply chain attack",
                        "DDoS attack",
                        "Ransomware attack"
                    ],
                    correct: 1
                },
                {
                    question: "How did the attackers distribute the SUNBURST malware to victims?",
                    options: [
                        "Malicious email attachments",
                        "Through legitimate SolarWinds software updates",
                        "USB devices",
                        "Social engineering"
                    ],
                    correct: 1
                },
                {
                    question: "Which security architecture principle was most violated in the SolarWinds attack?",
                    options: [
                        "Data redundancy",
                        "Implicit trust of software supply chain",
                        "Encryption of stored data",
                        "Multi-cloud resiliency"
                    ],
                    correct: 1
                },
                {
                    question: "What could have helped mitigate the damage caused by the SolarWinds attack?",
                    options: [
                        "Antivirus software",
                        "Longer passwords",
                        "Zero Trust Architecture and network segmentation",
                        "More user training"
                    ],
                    correct: 2
                },
                {
                    question: "Which federal entities were affected by the SolarWinds breach?",
                    options: [
                        "None",
                        "Multiple U.S. government agencies",
                        "Only financial institutions",
                        "Only health sector"
                    ],
                    correct: 1
                },
                {
                    question: "What is a Software Bill of Materials (SBOM)?",
                    options: [
                        "Invoice from a software company",
                        "A list of all components in a software product",
                        "License key repository",
                        "Cloud usage bill"
                    ],
                    correct: 1
                },
                {
                    question: "Why was SUNBURST hard to detect?",
                    options: [
                        "It deleted logs",
                        "It used legitimate processes and was digitally signed",
                        "It had a very large file size",
                        "It was encrypted with ransomware"
                    ],
                    correct: 1
                },
                {
                    question: "Which of the following tools would best detect behavior like SUNBURST's?",
                    options: [
                        "Firewall",
                        "IDS",
                        "Endpoint Detection and Response (EDR)",
                        "VPN"
                    ],
                    correct: 2
                },
                {
                    question: "What was the biggest long-term lesson learned from SolarWinds?",
                    options: [
                        "Emails need stronger filters",
                        "Data should only be stored on the cloud",
                        "Organizations must secure and validate their entire software supply chain",
                        "Remote work is unsafe"
                    ],
                    correct: 2
                }
            ],
            3: [ // Heartbleed Vulnerability
                {
                    question: "What was the name of the vulnerability that allowed attackers to read server memory in 2014?",
                    options: [
                        "Shellshock",
                        "Heartbleed",
                        "Log4Shell",
                        "BlueKeep"
                    ],
                    correct: 1
                },
                {
                    question: "What software was affected by the Heartbleed bug?",
                    options: [
                        "Apache Tomcat",
                        "OpenSSL",
                        "Microsoft IIS",
                        "NGINX"
                    ],
                    correct: 1
                },
                {
                    question: "What caused the Heartbleed vulnerability?",
                    options: [
                        "SQL injection",
                        "Outdated antivirus software",
                        "Missing bounds check in heartbeat function of OpenSSL",
                        "Weak encryption algorithm"
                    ],
                    correct: 2
                },
                {
                    question: "What could an attacker potentially steal using Heartbleed?",
                    options: [
                        "IP addresses",
                        "Private keys, passwords, and sensitive data from memory",
                        "Browser cookies only",
                        "File system access"
                    ],
                    correct: 1
                },
                {
                    question: "What is the CVE identifier associated with Heartbleed?",
                    options: [
                        "CVE-2015-1180",
                        "CVE-2014-1122",
                        "CVE-2014-0160",
                        "CVE-2013-2001"
                    ],
                    correct: 2
                },
                {
                    question: "How much data could be leaked per Heartbleed request?",
                    options: [
                        "1 MB",
                        "64 KB",
                        "256 KB",
                        "Unlimited"
                    ],
                    correct: 1
                },
                {
                    question: "Which of the following would best help detect Heartbleed exploitation?",
                    options: [
                        "Antivirus",
                        "Intrusion Detection System (IDS) analyzing TLS traffic",
                        "Disk encryption",
                        "CAPTCHA implementation"
                    ],
                    correct: 1
                },
                {
                    question: "What lesson does Heartbleed emphasize about open-source components?",
                    options: [
                        "Open-source is always secure",
                        "Open-source software must be reviewed and monitored",
                        "It's better to use proprietary software",
                        "Never use C or C++ for libraries"
                    ],
                    correct: 1
                },
                {
                    question: "What is the main architectural flaw exposed by Heartbleed?",
                    options: [
                        "Lack of firewall configuration",
                        "Misconfigured DNS",
                        "Insecure memory handling in cryptographic software",
                        "Improper port blocking"
                    ],
                    correct: 2
                },
                {
                    question: "Which cybersecurity principle could have reduced the impact of Heartbleed?",
                    options: [
                        "Data deduplication",
                        "Defense-in-depth and secure coding practices",
                        "Disk defragmentation",
                        "User training alone"
                    ],
                    correct: 1
                }
            ],
            4: [ // Target Data Breach
                {
                    question: "What was the initial attack vector in the Target data breach?",
                    options: [
                        "SQL Injection",
                        "Insider threat",
                        "Compromised credentials from a third-party vendor",
                        "Misconfigured firewall"
                    ],
                    correct: 2
                },
                {
                    question: "How did attackers gain access to Target's internal network?",
                    options: [
                        "Zero-day exploit",
                        "Through stolen credentials from an HVAC vendor",
                        "Via social media phishing",
                        "USB malware drop"
                    ],
                    correct: 1
                },
                {
                    question: "What critical security control was missing, allowing attackers to reach PoS systems?",
                    options: [
                        "Antivirus software",
                        "Network segmentation",
                        "Multi-cloud monitoring",
                        "Disk encryption"
                    ],
                    correct: 1
                },
                {
                    question: "What kind of malware was used to collect payment card information at Target?",
                    options: [
                        "Keylogger",
                        "RAM scraping malware",
                        "Ransomware",
                        "Spyware"
                    ],
                    correct: 1
                },
                {
                    question: "How many customer records were affected in total (approximate)?",
                    options: [
                        "10 million",
                        "110 million",
                        "200 million",
                        "500,000"
                    ],
                    correct: 1
                },
                {
                    question: "Which major architectural flaw allowed movement from vendor systems to PoS?",
                    options: [
                        "Lack of a data center",
                        "Public Wi-Fi exposure",
                        "Flat network with poor segmentation",
                        "Misuse of cloud services"
                    ],
                    correct: 2
                },
                {
                    question: "What is a key principle that could've limited the HVAC vendor's access?",
                    options: [
                        "Defense-by-default",
                        "Full access for testing",
                        "Least privilege",
                        "Denial of service"
                    ],
                    correct: 2
                },
                {
                    question: "Which tool reportedly generated alerts that were ignored during the attack?",
                    options: [
                        "Nmap",
                        "FireEye",
                        "Wireshark",
                        "Metasploit"
                    ],
                    correct: 1
                },
                {
                    question: "What lesson about third-party risk is highlighted in this breach?",
                    options: [
                        "Vendors should be blocked from all access",
                        "Third-party access should be limited and monitored",
                        "Vendors are always secure",
                        "Third-party risk doesn't affect architecture"
                    ],
                    correct: 1
                },
                {
                    question: "What type of system was the primary target of the malware in this breach?",
                    options: [
                        "Email server",
                        "Database server",
                        "Point-of-Sale (PoS) systems",
                        "HR portal"
                    ],
                    correct: 2
                }
            ],
            5: [ // WannaCry Ransomware
                {
                    question: "What vulnerability did WannaCry exploit to spread?",
                    options: [
                        "Heartbleed",
                        "EternalBlue (SMBv1 vulnerability)",
                        "BlueKeep",
                        "Shellshock"
                    ],
                    correct: 1
                },
                {
                    question: "What protocol was primarily exploited in WannaCry attacks?",
                    options: [
                        "FTP",
                        "HTTP",
                        "SMBv1",
                        "SNMP"
                    ],
                    correct: 2
                },
                {
                    question: "What is the CVE associated with WannaCry's main exploit?",
                    options: [
                        "CVE-2015-2545",
                        "CVE-2017-5638",
                        "CVE-2017-0144",
                        "CVE-2019-0708"
                    ],
                    correct: 2
                },
                {
                    question: "What behavior made WannaCry especially dangerous?",
                    options: [
                        "It targeted only Linux servers",
                        "It could spread automatically across networks (worm)",
                        "It bypassed antivirus",
                        "It was impossible to decrypt files"
                    ],
                    correct: 1
                },
                {
                    question: "What could have prevented most infections?",
                    options: [
                        "Using a VPN",
                        "Installing more RAM",
                        "Applying Microsoft's security patch MS17-010",
                        "Disabling firewalls"
                    ],
                    correct: 2
                },
                {
                    question: "Which high-profile sector was severely impacted in the UK?",
                    options: [
                        "Banking",
                        "Healthcare (NHS)",
                        "Education",
                        "Agriculture"
                    ],
                    correct: 1
                },
                {
                    question: "What key architectural control was lacking in many victim organizations?",
                    options: [
                        "Antivirus",
                        "Network segmentation and patch management",
                        "Data deduplication",
                        "Smart cards"
                    ],
                    correct: 1
                },
                {
                    question: "How did WannaCry demand ransom payment?",
                    options: [
                        "Credit card",
                        "Bitcoin",
                        "Western Union",
                        "Ethereum"
                    ],
                    correct: 1
                },
                {
                    question: "What is the recommended action regarding SMBv1 today?",
                    options: [
                        "Keep enabled for legacy apps",
                        "Disable immediately; it's outdated and insecure",
                        "Replace with FTP",
                        "Move to IPv6"
                    ],
                    correct: 1
                },
                {
                    question: "What core lesson does WannaCry teach us?",
                    options: [
                        "Avoid installing apps from unknown sources",
                        "Timely patching and legacy protocol hardening are critical",
                        "Increase internet speed",
                        "Run antivirus scans weekly"
                    ],
                    correct: 1
                }
            ],
            6: [ // Twitter Hack
                {
                    question: "What was the primary method attackers used in the 2020 Twitter breach?",
                    options: [
                        "SQL injection",
                        "Social engineering via phishing",
                        "Zero-day malware",
                        "Public Wi-Fi sniffing"
                    ],
                    correct: 1
                },
                {
                    question: "What was the attackers' main goal in the Twitter hack?",
                    options: [
                        "Delete user accounts",
                        "Promote a Bitcoin scam",
                        "Install ransomware",
                        "Deface the website"
                    ],
                    correct: 1
                },
                {
                    question: "Approximately how many high-profile Twitter accounts were compromised?",
                    options: [
                        "50",
                        "75",
                        "130",
                        "300"
                    ],
                    correct: 2
                },
                {
                    question: "What was the root cause of the Twitter breach?",
                    options: [
                        "A vulnerability in the mobile app",
                        "Abuse of internal administrative tools through employee compromise",
                        "An AWS misconfiguration",
                        "DNS hijacking"
                    ],
                    correct: 1
                },
                {
                    question: "Which key cybersecurity model was NOT properly implemented at Twitter?",
                    options: [
                        "Cloud-native model",
                        "Zero Trust model",
                        "DevOps model",
                        "Encryption-in-transit"
                    ],
                    correct: 1
                },
                {
                    question: "What control could have prevented access to admin tools after initial compromise?",
                    options: [
                        "Antivirus software",
                        "Multi-factor authentication (MFA)",
                        "CAPTCHA",
                        "HTTPS"
                    ],
                    correct: 1
                },
                {
                    question: "What type of phishing was used in this attack?",
                    options: [
                        "Email phishing",
                        "Link farming",
                        "Spear phishing via phone (vishing)",
                        "Baiting with USBs"
                    ],
                    correct: 2
                },
                {
                    question: "Which principle was violated by allowing too many employees admin access?",
                    options: [
                        "Logging and monitoring",
                        "Least privilege",
                        "Availability",
                        "Network address translation"
                    ],
                    correct: 1
                },
                {
                    question: "What action did Twitter take during the attack to mitigate damage?",
                    options: [
                        "Disabled all accounts",
                        "Temporarily disabled tweets from verified accounts",
                        "Turned off mobile access",
                        "Deleted user DMs"
                    ],
                    correct: 1
                },
                {
                    question: "What is the biggest long-term security takeaway from the Twitter 2020 breach?",
                    options: [
                        "Don't use Bitcoin",
                        "Even internal systems must follow strong authentication and monitoring",
                        "APIs are always insecure",
                        "Cloud providers are to blame"
                    ],
                    correct: 1
                }
            ],
            7: [ // Capital One Data Breach
                {
                    question: "What type of vulnerability was exploited in the Capital One breach?",
                    options: [
                        "SQL Injection",
                        "Server-Side Request Forgery (SSRF)",
                        "Buffer Overflow",
                        "DNS Spoofing"
                    ],
                    correct: 1
                },
                {
                    question: "What cloud service provider was involved in the breach?",
                    options: [
                        "Microsoft Azure",
                        "Amazon Web Services (AWS)",
                        "Google Cloud",
                        "IBM Cloud"
                    ],
                    correct: 1
                },
                {
                    question: "What was the attacker's profession before the breach?",
                    options: [
                        "Former Capital One employee",
                        "Former AWS employee",
                        "Freelance hacker",
                        "University student"
                    ],
                    correct: 1
                },
                {
                    question: "Which AWS component was misused to gain access to S3 buckets?",
                    options: [
                        "IAM user",
                        "EC2 instance metadata service",
                        "AWS Lambda",
                        "RDS endpoint"
                    ],
                    correct: 1
                },
                {
                    question: "How was the breach initially discovered?",
                    options: [
                        "By Capital One's SOC team",
                        "By an external GitHub user",
                        "Through an antivirus alert",
                        "By AWS"
                    ],
                    correct: 1
                },
                {
                    question: "What security principle could have prevented wide access to S3 data?",
                    options: [
                        "Defense by obscurity",
                        "Principle of least privilege (PoLP)",
                        "Rate limiting",
                        "Access through CDN"
                    ],
                    correct: 1
                },
                {
                    question: "What can block SSRF attacks in AWS environments?",
                    options: [
                        "Increasing disk quota",
                        "Using EC2 IMDSv2 and WAF",
                        "Deleting CloudWatch logs",
                        "Changing bucket region"
                    ],
                    correct: 1
                },
                {
                    question: "What kind of data was leaked in the breach?",
                    options: [
                        "Only public financial records",
                        "SSNs, credit scores, account info, names, etc.",
                        "Encrypted videos",
                        "VPN logs"
                    ],
                    correct: 1
                },
                {
                    question: "What service can detect abnormal access patterns in AWS?",
                    options: [
                        "S3 Lifecycle",
                        "EC2 Snapshot",
                        "GuardDuty",
                        "CloudFormation"
                    ],
                    correct: 2
                },
                {
                    question: "What was one of the root causes of the Capital One breach?",
                    options: [
                        "Weak encryption algorithms",
                        "Misconfigured IAM roles and firewall policies",
                        "Lack of antivirus",
                        "SQL Injection vulnerability"
                    ],
                    correct: 1
                }
            ],
            8: [ // Mirai Botnet Attack
                {
                    question: "What type of cyberattack was launched using the Mirai botnet?",
                    options: [
                        "Ransomware",
                        "Distributed Denial of Service (DDoS)",
                        "SQL Injection",
                        "Cross-site scripting (XSS)"
                    ],
                    correct: 1
                },
                {
                    question: "Which type of devices did Mirai primarily target?",
                    options: [
                        "Desktop computers",
                        "Internet of Things (IoT) devices",
                        "Smartphones",
                        "Cloud servers"
                    ],
                    correct: 1
                },
                {
                    question: "What was the key method used to compromise IoT devices in the Mirai attack?",
                    options: [
                        "Zero-day exploits",
                        "Phishing emails",
                        "Default and hardcoded credentials",
                        "Fileless malware"
                    ],
                    correct: 2
                },
                {
                    question: "What major DNS provider was attacked by the Mirai botnet in October 2016?",
                    options: [
                        "Cloudflare",
                        "Dyn",
                        "GoDaddy",
                        "Akamai"
                    ],
                    correct: 1
                },
                {
                    question: "What was one major consequence of the Dyn DDoS attack?",
                    options: [
                        "Data was leaked publicly",
                        "Major websites became inaccessible globally",
                        "Financial fraud occurred",
                        "Email servers were hijacked"
                    ],
                    correct: 1
                },
                {
                    question: "What security measure can reduce brute-force login attempts on devices?",
                    options: [
                        "Disk encryption",
                        "Rate limiting and account lockout",
                        "DNS tunneling",
                        "Packet sniffing"
                    ],
                    correct: 1
                },
                {
                    question: "Why were IoT devices ideal targets for Mirai?",
                    options: [
                        "They used Linux",
                        "They often had weak security and default credentials",
                        "They had built-in DDoS tools",
                        "They stored sensitive data"
                    ],
                    correct: 1
                },
                {
                    question: "What is a good architectural defense against botnets like Mirai?",
                    options: [
                        "Antivirus",
                        "SMS-based 2FA",
                        "Network segmentation and outbound traffic monitoring",
                        "Disabling Wi-Fi"
                    ],
                    correct: 2
                },
                {
                    question: "How much traffic (approx.) did Mirai generate in the Dyn DDoS attack?",
                    options: [
                        "100 Mbps",
                        "10 Gbps",
                        "100 Gbps",
                        "Over 1 Tbps"
                    ],
                    correct: 3
                },
                {
                    question: "Which principle was violated by shipping devices with unchanged login credentials?",
                    options: [
                        "Role-based access",
                        "Security by default",
                        "Encryption in transit",
                        "Zero-day mitigation"
                    ],
                    correct: 1
                }
            ],
            9: [ // Google's BeyondCorp Initiative
                {
                    question: "What security model does Google's BeyondCorp Initiative follow?",
                    options: [
                        "Perimeter-based model",
                        "Zero Trust Architecture",
                        "Hub-and-spoke model",
                        "Cloud-native firewall"
                    ],
                    correct: 1
                },
                {
                    question: "Which attack prompted Google to begin the BeyondCorp project?",
                    options: [
                        "Mirai Botnet",
                        "Operation Aurora",
                        "Stuxnet",
                        "NotPetya"
                    ],
                    correct: 1
                },
                {
                    question: "What is a key principle of Zero Trust?",
                    options: [
                        "Trust all internal users",
                        "Never trust, always verify",
                        "Trust VPN only",
                        "Block internet access"
                    ],
                    correct: 1
                },
                {
                    question: "In BeyondCorp, what replaces VPN-based access?",
                    options: [
                        "Email OTPs",
                        "Secure access via identity-aware proxies and policies",
                        "IP-based firewalls",
                        "Cloud-based DNS"
                    ],
                    correct: 1
                },
                {
                    question: "What factors are used to grant access in BeyondCorp?",
                    options: [
                        "Internet speed",
                        "Device health, user identity, context",
                        "Username only",
                        "Firewall location"
                    ],
                    correct: 1
                },
                {
                    question: "What architecture concept does BeyondCorp eliminate?",
                    options: [
                        "Redundant storage",
                        "Implicit trust based on network location",
                        "Log rotation",
                        "TCP-based access"
                    ],
                    correct: 1
                },
                {
                    question: "What kind of proxy does BeyondCorp use for traffic routing?",
                    options: [
                        "Load balancer",
                        "Access proxy",
                        "Reverse DNS",
                        "CDN"
                    ],
                    correct: 1
                },
                {
                    question: "How does BeyondCorp evaluate risk?",
                    options: [
                        "Based on random sampling",
                        "Based on real-time context like device posture and user behavior",
                        "Only after login",
                        "Based on password strength only"
                    ],
                    correct: 1
                },
                {
                    question: "What security feature is critical for enforcing BeyondCorp access?",
                    options: [
                        "VLAN tagging",
                        "Multi-factor authentication (MFA)",
                        "Port forwarding",
                        "Email filtering"
                    ],
                    correct: 1
                },
                {
                    question: "What key lesson can enterprises learn from BeyondCorp?",
                    options: [
                        "Perimeter security is enough if patched",
                        "Identity and device context must drive access decisions",
                        "VPNs are always secure",
                        "Blocking USBs fixes most risks"
                    ],
                    correct: 1
                }
            ],
            10: [ // WhatsApp Vulnerability
                {
                    question: "What type of vulnerability was exploited in the 2019 WhatsApp attack?",
                    options: [
                        "SQL Injection",
                        "Buffer Overflow in VoIP stack",
                        "Cross-site scripting",
                        "DNS Spoofing"
                    ],
                    correct: 1
                },
                {
                    question: "Which group is believed to have developed the exploit?",
                    options: [
                        "Anonymous",
                        "LulzSec",
                        "NSO Group (Pegasus spyware)",
                        "APT29"
                    ],
                    correct: 2
                },
                {
                    question: "What made the attack especially dangerous?",
                    options: [
                        "Required phishing email",
                        "Required no user interaction — just a WhatsApp call",
                        "Required user login credentials",
                        "Relied on brute-force password attack"
                    ],
                    correct: 1
                },
                {
                    question: "What kind of spyware was delivered in the WhatsApp attack?",
                    options: [
                        "Ransomware",
                        "Pegasus",
                        "WannaCry",
                        "Keylogger"
                    ],
                    correct: 1
                },
                {
                    question: "Which platforms were affected by the vulnerability?",
                    options: [
                        "Android only",
                        "iOS only",
                        "Both Android and iOS",
                        "Windows Mobile"
                    ],
                    correct: 2
                },
                {
                    question: "What mobile security principle was violated due to overprivileged apps?",
                    options: [
                        "Data retention",
                        "Least privilege",
                        "Rate limiting",
                        "Single sign-on"
                    ],
                    correct: 1
                },
                {
                    question: "What kind of secure coding technique could have prevented this exploit?",
                    options: [
                        "Minification",
                        "Memory-safe code and buffer validation",
                        "App theming",
                        "SSL pinning"
                    ],
                    correct: 1
                },
                {
                    question: "What is the role of ASLR in preventing such attacks?",
                    options: [
                        "Encrypts data at rest",
                        "Randomizes memory layout to prevent buffer overflows",
                        "Secures VPN connections",
                        "Detects spyware signatures"
                    ],
                    correct: 1
                },
                {
                    question: "How did WhatsApp respond after the exploit was discovered?",
                    options: [
                        "Shut down the app",
                        "Released a security patch and informed affected users",
                        "Changed logo",
                        "Switched to desktop-only"
                    ],
                    correct: 1
                },
                {
                    question: "What is the broader lesson for communication apps from this case?",
                    options: [
                        "Move to voice-only calls",
                        "Real-time apps must enforce secure memory and permission controls",
                        "Avoid encrypted messaging",
                        "Don't update apps frequently"
                    ],
                    correct: 1
                }
            ],
            11: [ // Maersk NotPetya Attack
                {
                    question: "What type of malware was NotPetya originally classified as?",
                    options: [
                        "Adware",
                        "Ransomware (but functioned as a wiper)",
                        "Spyware",
                        "Rootkit"
                    ],
                    correct: 1
                },
                {
                    question: "How did NotPetya enter Maersk's network?",
                    options: [
                        "Phishing email",
                        "Trojanized update of Ukrainian software (MeDoc)",
                        "USB drop",
                        "Unpatched router"
                    ],
                    correct: 1
                },
                {
                    question: "What made NotPetya especially destructive within networks like Maersk?",
                    options: [
                        "Used only DNS tunneling",
                        "Worm-like propagation and inability to decrypt files",
                        "Relied on air-gapped networks",
                        "Attacked only Linux servers"
                    ],
                    correct: 1
                },
                {
                    question: "Which tools did NotPetya use for lateral movement?",
                    options: [
                        "Tor and SSH brute force",
                        "EternalBlue exploit and Mimikatz",
                        "Telnet scanning",
                        "Web application injection"
                    ],
                    correct: 1
                },
                {
                    question: "What was the estimated financial damage to Maersk from this attack?",
                    options: [
                        "$10 million",
                        "$50 million",
                        "$200–300 million",
                        "Unknown"
                    ],
                    correct: 2
                },
                {
                    question: "What critical recovery action saved Maersk's Active Directory infrastructure?",
                    options: [
                        "Rebuilt from scratch using AI",
                        "Used a domain controller backup found in Ghana",
                        "Switched to AWS overnight",
                        "Hired external ethical hackers"
                    ],
                    correct: 1
                },
                {
                    question: "Which of the following was a key architectural flaw at Maersk?",
                    options: [
                        "Too many passwords",
                        "Flat internal network with no segmentation",
                        "Use of Linux systems",
                        "Misconfigured VPN tunnel"
                    ],
                    correct: 1
                },
                {
                    question: "Why is NotPetya considered a wiper rather than true ransomware?",
                    options: [
                        "It infected mobile apps",
                        "It had no functional decryption mechanism",
                        "It asked for payment in Ethereum",
                        "It came from the App Store"
                    ],
                    correct: 1
                },
                {
                    question: "What is a key lesson for enterprise architecture from this case?",
                    options: [
                        "Avoid using Windows OS",
                        "Network segmentation and verified backups are critical",
                        "Block all outbound connections",
                        "Use biometric login everywhere"
                    ],
                    correct: 1
                },
                {
                    question: "What strategic practice could have prevented the initial compromise?",
                    options: [
                        "Firewalls only",
                        "Software supply chain validation and patch controls",
                        "Captcha on all apps",
                        "Longer Wi-Fi passwords"
                    ],
                    correct: 1
                }
            ],
            12: [ // Facebook-Cambridge Analytica Scandal
                {
                    question: "What kind of violation was at the heart of the Facebook–Cambridge Analytica scandal?",
                    options: [
                        "Malware injection",
                        "Data privacy and consent violation",
                        "Phishing scam",
                        "Insider threat"
                    ],
                    correct: 1
                },
                {
                    question: "Approximately how many user profiles were affected?",
                    options: [
                        "10 million",
                        "25 million",
                        "~87 million",
                        "5 billion"
                    ],
                    correct: 2
                },
                {
                    question: "How was the data collected from users?",
                    options: [
                        "Through email surveys",
                        "Via a quiz app that accessed both user and friend data",
                        "Hacked from Facebook's servers",
                        "Scraped from public comments"
                    ],
                    correct: 1
                },
                {
                    question: "Which third-party company used the harvested data for political profiling?",
                    options: [
                        "Palantir",
                        "Cambridge Analytica",
                        "NSO Group",
                        "Shadow Brokers"
                    ],
                    correct: 1
                },
                {
                    question: "What core principle of data protection was violated?",
                    options: [
                        "Two-factor authentication",
                        "Informed user consent",
                        "End-to-end encryption",
                        "Availability"
                    ],
                    correct: 1
                },
                {
                    question: "What was Facebook's largest fine from the FTC related to this case?",
                    options: [
                        "$500,000",
                        "$1 billion",
                        "$5 billion",
                        "No fine was issued"
                    ],
                    correct: 2
                },
                {
                    question: "What did the quiz app 'This Is Your Digital Life' collect from users?",
                    options: [
                        "Just name and email",
                        "Personal data + friend data via Facebook APIs",
                        "Only profile pictures",
                        "Browser history"
                    ],
                    correct: 1
                },
                {
                    question: "What kind of controls could have prevented the large-scale data misuse?",
                    options: [
                        "Better antivirus",
                        "API rate limiting and third-party permission restrictions",
                        "More CAPTCHA",
                        "Logging out daily"
                    ],
                    correct: 1
                },
                {
                    question: "Which regulatory law was later strengthened due to such scandals?",
                    options: [
                        "HIPAA",
                        "GDPR / CCPA",
                        "PCI-DSS",
                        "FERPA"
                    ],
                    correct: 1
                },
                {
                    question: "What architectural best practice was missing from Facebook's platform at the time?",
                    options: [
                        "HTTPS encryption",
                        "Continuous monitoring and data use enforcement for third-party apps",
                        "Offline backups",
                        "Token-based Wi-Fi"
                    ],
                    correct: 1
                }
            ],
            13: [ // AI in Detecting Phishing Attacks
                {
                    question: "Why is AI increasingly used to detect phishing attacks?",
                    options: [
                        "It is cheaper than antivirus",
                        "It detects sophisticated, evolving phishing tactics better than rules-based systems",
                        "It replaces passwords",
                        "It blocks all spam"
                    ],
                    correct: 1
                },
                {
                    question: "What AI technique is used to analyze the wording and tone of phishing emails?",
                    options: [
                        "Image recognition",
                        "Natural Language Processing (NLP)",
                        "CAPTCHA",
                        "IP spoofing"
                    ],
                    correct: 1
                },
                {
                    question: "Which of the following is a key indicator AI looks for in phishing URLs?",
                    options: [
                        "GIF animations",
                        "Domain age and reputation",
                        "JavaScript performance",
                        "Screen brightness"
                    ],
                    correct: 1
                },
                {
                    question: "What advantage does AI provide in phishing detection?",
                    options: [
                        "Stops all malware",
                        "Detects zero-day phishing attacks without needing signature updates",
                        "Encrypts email automatically",
                        "Blocks USB ports"
                    ],
                    correct: 1
                },
                {
                    question: "What is a major challenge in using AI for phishing detection?",
                    options: [
                        "Internet speed",
                        "Antivirus compatibility",
                        "Need for large, labeled datasets for training",
                        "Lack of JavaScript"
                    ],
                    correct: 2
                },
                {
                    question: "What security tool often integrates AI-based phishing detection?",
                    options: [
                        "Disk defragmenter",
                        "Email security gateways or SOC tools",
                        "Word processors",
                        "USB scanners"
                    ],
                    correct: 1
                },
                {
                    question: "What technique helps detect phishing sites mimicking real websites visually?",
                    options: [
                        "VPN",
                        "Computer Vision",
                        "Keylogging",
                        "Tokenization"
                    ],
                    correct: 1
                },
                {
                    question: "Which type of AI model requires labeled examples of phishing and non-phishing data?",
                    options: [
                        "Unsupervised learning",
                        "Supervised learning",
                        "Reinforcement learning only",
                        "Genetic algorithms"
                    ],
                    correct: 1
                },
                {
                    question: "Which feature of AI systems can help reduce SOC analyst workload?",
                    options: [
                        "CAPTCHA solving",
                        "Automated email classification and threat scoring",
                        "Log file compression",
                        "Keyboard locking"
                    ],
                    correct: 1
                },
                {
                    question: "What should organizations do to improve AI phishing detection over time?",
                    options: [
                        "Reduce internet bandwidth",
                        "Retrain models using incident feedback (feedback loops)",
                        "Avoid antivirus",
                        "Block all marketing emails"
                    ],
                    correct: 1
                }
            ],
            14: [ // Equifax Data Breach (2017)
                {
                    question: "What was the primary cause of the Equifax data breach in 2017?",
                    options: [
                        "Insider threat",
                        "Weak password policies",
                        "Unpatched Apache Struts vulnerability",
                        "Phishing attack"
                    ],
                    correct: 2
                },
                {
                    question: "Approximately how many individuals were affected by the Equifax breach?",
                    options: [
                        "50 million",
                        "100 million",
                        "147 million",
                        "200 million"
                    ],
                    correct: 2
                },
                {
                    question: "What critical security control was missing, which allowed attackers to move laterally within Equifax's network?",
                    options: [
                        "Two-factor authentication",
                        "Network segmentation",
                        "Web application firewall",
                        "SIEM logging"
                    ],
                    correct: 1
                },
                {
                    question: "Which of the following data types was NOT stolen in the Equifax breach?",
                    options: [
                        "Social Security Numbers",
                        "Medical Records",
                        "Dates of Birth",
                        "Credit Card Numbers"
                    ],
                    correct: 1
                },
                {
                    question: "What vulnerability identifier (CVE) was linked to the Equifax breach?",
                    options: [
                        "CVE-2016-0800",
                        "CVE-2018-11776",
                        "CVE-2017-5638",
                        "CVE-2015-4852"
                    ],
                    correct: 2
                },
                {
                    question: "Why did Equifax fail to apply the critical patch in time?",
                    options: [
                        "They were unaware of the vulnerability.",
                        "Patch was not released yet.",
                        "Poor asset inventory and tracking systems.",
                        "They applied it, but it failed."
                    ],
                    correct: 2
                },
                {
                    question: "What security best practice could have prevented data exfiltration during the breach?",
                    options: [
                        "Role-based access control",
                        "Encryption of data at rest",
                        "VPN tunneling",
                        "Multi-cloud deployment"
                    ],
                    correct: 1
                },
                {
                    question: "How long did the attackers remain undetected in Equifax's network?",
                    options: [
                        "Less than a week",
                        "Around 15 days",
                        "76 days",
                        "Over 1 year"
                    ],
                    correct: 2
                },
                {
                    question: "What was one of the major architectural flaws in Equifax's security posture?",
                    options: [
                        "Excessive firewall rules",
                        "Lack of Zero Trust model implementation",
                        "Strong password policy",
                        "Limited user access"
                    ],
                    correct: 1
                },
                {
                    question: "What security tool would have helped detect the breach earlier?",
                    options: [
                        "Antivirus software",
                        "SIEM (Security Information and Event Management)",
                        "Load balancer",
                        "IP spoofing tool"
                    ],
                    correct: 1
                }
            ],
            15: [ // SQL Injection on Sony Pictures (2011)
                {
                    question: "What type of cyberattack was used in the Sony Pictures breach of 2011?",
                    options: [
                        "Ransomware",
                        "Phishing",
                        "SQL Injection",
                        "Buffer overflow"
                    ],
                    correct: 2
                },
                {
                    question: "Which hacker group claimed responsibility for the Sony breach?",
                    options: [
                        "Anonymous",
                        "LulzSec",
                        "Shadow Brokers",
                        "Fancy Bear"
                    ],
                    correct: 1
                },
                {
                    question: "What critical database security mistake did Sony make?",
                    options: [
                        "Disabled user accounts",
                        "Used strong encryption",
                        "Stored passwords in plaintext",
                        "Disabled the firewall"
                    ],
                    correct: 2
                },
                {
                    question: "What is the key vulnerability exploited in SQL injection attacks?",
                    options: [
                        "Weak password policy",
                        "Lack of input validation/sanitization",
                        "Use of cloud services",
                        "Outdated hardware"
                    ],
                    correct: 1
                },
                {
                    question: "What does a Web Application Firewall (WAF) help prevent?",
                    options: [
                        "DDOS attacks only",
                        "SQL injection and other application-layer attacks",
                        "Disk failure",
                        "Physical theft"
                    ],
                    correct: 1
                },
                {
                    question: "Which of the following is the best defense against SQL injection?",
                    options: [
                        "Encrypting the database",
                        "Using parameterized queries (prepared statements)",
                        "Using complex passwords",
                        "Setting up a VPN"
                    ],
                    correct: 1
                },
                {
                    question: "How many user records were reportedly compromised in the Sony SQLi breach?",
                    options: [
                        "10,000",
                        "100,000",
                        "Over 1 million",
                        "Unknown"
                    ],
                    correct: 2
                },
                {
                    question: "What security principle did Sony violate by allowing DB users full permissions?",
                    options: [
                        "Role-based access control",
                        "Least privilege",
                        "Defense in depth",
                        "Fail-safe default"
                    ],
                    correct: 1
                },
                {
                    question: "What tool could have detected such SQL vulnerabilities before launch?",
                    options: [
                        "Wireshark",
                        "OWASP ZAP or Burp Suite",
                        "VPN",
                        "Hypervisor"
                    ],
                    correct: 1
                },
                {
                    question: "What major design flaw exposed Sony's backend database?",
                    options: [
                        "No HTTPS",
                        "No proper segmentation between frontend and backend",
                        "Use of IPv6",
                        "Lack of antivirus"
                    ],
                    correct: 1
                }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.renderCaseStudies();
        this.bindEvents();
        this.updateStats();
    }
    
    renderCaseStudies() {
        const container = document.getElementById('case-studies-container');
        container.innerHTML = '';
        
        this.caseStudies.forEach(study => {
            const card = document.createElement('div');
            card.className = 'case-study-card';
            card.dataset.id = study.id;
            
            card.innerHTML = `
                <h3>${study.title}</h3>
                <p>${study.description}</p>
            `;
            
            card.addEventListener('click', () => this.toggleCaseStudy(study.id));
            container.appendChild(card);
        });
    }
    
    toggleCaseStudy(id) {
        const card = document.querySelector(`[data-id="${id}"]`);
        const index = this.selectedCaseStudies.indexOf(id);
        
        if (index > -1) {
            this.selectedCaseStudies.splice(index, 1);
            card.classList.remove('selected');
        } else {
            this.selectedCaseStudies.push(id);
            card.classList.add('selected');
        }
        
        this.updateStats();
    }
    
    updateStats() {
        const progressElement = document.getElementById('progress');
        const progress = this.selectedCaseStudies.length > 0 ? 
            Math.round((this.selectedCaseStudies.length / this.caseStudies.length) * 100) : 0;
        progressElement.textContent = `${progress}%`;
    }
    
    bindEvents() {
        // Start quiz button
        document.getElementById('start-quiz-btn').addEventListener('click', () => {
            if (this.selectedCaseStudies.length === 0) {
                alert('Please select at least one case study to start the quiz.');
                return;
            }
            this.startQuiz();
        });
        
        // Navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        
        // Results screen buttons
        document.getElementById('retry-btn').addEventListener('click', () => this.retryQuiz());
        document.getElementById('home-btn').addEventListener('click', () => this.goHome());
    }
    
    startQuiz() {
        // Prepare questions for selected case studies
        this.allQuestions = [];
        this.selectedCaseStudies.forEach(studyId => {
            if (this.questions[studyId]) {
                this.allQuestions.push(...this.questions[studyId].map(q => ({
                    ...q,
                    caseStudyId: studyId,
                    caseStudyTitle: this.caseStudies.find(s => s.id === studyId).title
                })));
            }
        });
        
        // Shuffle questions
        this.allQuestions = this.shuffleArray(this.allQuestions);
        
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.score = 0;
        this.correctAnswers = 0;
        this.totalQuestions = this.allQuestions.length;
        
        this.showScreen('quiz');
        this.displayQuestion();
    }
    
    displayQuestion() {
        if (this.currentQuestionIndex >= this.allQuestions.length) {
            this.showResults();
            return;
        }
        
        const question = this.allQuestions[this.currentQuestionIndex];
        
        // Update header
        document.getElementById('current-topic').textContent = question.caseStudyTitle;
        document.getElementById('question-counter').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}`;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        document.getElementById('question-progress').style.width = `${progress}%`;
        
        // Display question
        document.getElementById('question-text').textContent = question.question;
        
        // Display options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" name="question" value="${index}" id="option-${index}">
                <label for="option-${index}">${option}</label>
            `;
            
            // Check if already answered
            if (this.answers[this.currentQuestionIndex] !== undefined) {
                if (this.answers[this.currentQuestionIndex] === index) {
                    optionElement.classList.add('selected');
                }
                if (index === question.correct) {
                    optionElement.classList.add('correct');
                } else if (this.answers[this.currentQuestionIndex] === index && index !== question.correct) {
                    optionElement.classList.add('incorrect');
                }
            }
            
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    selectOption(optionIndex) {
        const question = this.allQuestions[this.currentQuestionIndex];
        this.answers[this.currentQuestionIndex] = optionIndex;
        
        // Update option styling
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            option.classList.remove('selected', 'correct', 'incorrect');
            
            if (index === optionIndex) {
                option.classList.add('selected');
            }
            
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === optionIndex && index !== question.correct) {
                option.classList.add('incorrect');
            }
        });
        
        // Update score
        if (optionIndex === question.correct) {
            this.correctAnswers++;
            this.score += 10;
        }
        
        // Update header stats
        document.getElementById('score').textContent = this.score;
        
        this.updateNavigationButtons();
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = this.currentQuestionIndex === 0;
        nextBtn.textContent = this.currentQuestionIndex === this.allQuestions.length - 1 ? 'Finish' : 'Next';
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }
    
    nextQuestion() {
        if (this.answers[this.currentQuestionIndex] === undefined) {
            alert('Please select an answer before continuing.');
            return;
        }
        
        if (this.currentQuestionIndex < this.allQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }
    
    showResults() {
        const accuracy = Math.round((this.correctAnswers / this.totalQuestions) * 100);
        
        document.getElementById('correct-answers').textContent = this.correctAnswers;
        document.getElementById('incorrect-answers').textContent = this.totalQuestions - this.correctAnswers;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        
        this.showScreen('results');
    }
    
    retryQuiz() {
        this.startQuiz();
    }
    
    goHome() {
        this.selectedCaseStudies = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.score = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        
        this.renderCaseStudies();
        this.updateStats();
        this.showScreen('welcome');
    }
    
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
}); 