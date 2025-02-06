import phoneIcon from "./assets/images/phone.png";
import emailIcon from "./assets/images/email.png";

import './App.css';
import React, { useState, createContext, useContext } from "react";
const translations = {
  en: {
    aboutMe: "About Me",
    technologies: "Technologies of choice",
    softSkills: "Soft Skills",
    education: "Formal Education",
    workExperience: "Work Experience",
    languages: "Languages",
    conferences: "Conferences",
    additionalInfo: "Additional Information",
    otherProjects: "Other Projects",
    consent: "I hereby agree for processing the following personal information strictly for the purposes of recruitment processes...",
  },
  pl: {
    aboutMe: "O mnie",
    technologies: "Technologie, których używam",
    softSkills: "Umiejętności miękkie",
    education: "Edukacja",
    workExperience: "Doświadczenie zawodowe",
    languages: "Języki",
    conferences: "Konferencje",
    additionalInfo: "Dodatkowe informacje",
    otherProjects: "Inne projekty",
    consent: "Wyrażam zgodę na przetwarzanie moich danych osobowych w celu procesów rekrutacyjnych...",
  },
};
const LanguageContext = createContext();

const App = () => {
  const [language, setLanguage] = useState("en");
  const toggleLanguage = (lang) => setLanguage(lang);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>      
    <div className="container">
      <LanguageSwitcher currentLanguage={language} toggleLanguage={setLanguage}/>
      <aside className="sidebar">
        <h1>Piotr Falkowski</h1>
        <p>Senior Backend Software Developer with 10+ years of experience.</p>
        <ContactInfo />
      </aside>
      <main className="content">
        <Section id="about-me" title="About Me">
          <p>I learned C++ to build a stock market prediction system using artificial neural networks.
             While this is a project I still support and use, it led me to unique jurney through brighter and darker sides of software development.
             My exposure to legacy systems codebase led me to shift towards radical simplicity.</p>
          <p>Beyond work, I actively develop <a href='https://stockinsight.pl'>Stockinsight.pl</a>,
           an automated stock market analysis tool, serve as CTO of <a href='https://squizzu.com'>Squizzu.com</a>,
            a tech quiz platform and maintain many open-source C# libraries on NuGet,
             covering areas such as logging, statistics, serialization and developer productivity.</p>
        </Section>
        <TechnicalSkills />
        <SoftSkills />
        <Education />
        <WorkExperience />
        <OtherProjects />
        <Languages />
        <Conferences />
        <AdditionalInfo />
        <ConsentSection />
      </main>
    </div>
    </LanguageContext.Provider>
  );
};

const LanguageSwitcher = ({ currentLanguage, toggleLanguage }) => {
  return (
    <div className="language-switcher">
      <div 
        className={`item ${currentLanguage === "en" ? "active" : ""}`} 
        data-value="en" 
        onClick={() => toggleLanguage("en")}
      >
        <span className="flag-icon flag-icon-us"></span>
      </div>
      <div 
        className={`item ${currentLanguage === "pl" ? "active" : ""}`} 
        data-value="pl" 
        onClick={() => toggleLanguage("pl")}
      >
        <span className="flag-icon flag-icon-pl"></span>
      </div>
    </div>
  );
};


const ContactInfo = () => (
  <div className="contact-info">
    {[
      { className: "fas fa-phone", img: phoneIcon },
      { className: "fas fa-envelope", img: emailIcon },
      { className: "fas fa-cube", link: "https://nuget.org/profiles/pfalkowski", text: "nuget.org/profiles/pfalkowski" },
      { className: "fab fa-github", link: "https://github.com/pfalkowski", text: "github.com/pfalkowski" },
      { className: "fab fa-stack-overflow", link: "https://stackoverflow.com/users/3922292", text: "stackoverflow.com/users/3922292" },
      { className: "fab fa-linkedin", link: "https://pl.linkedin.com/in/piotrfalkowski", text: "pl.linkedin.com/in/piotrfalkowski" },
    ].map((item, index) => (
      <div className="contact-item" key={index}>
        <i className={item.className}></i>
        {item.img ? 
          <img src={`${item.img}`} alt = ""/>
          : <span><ExternalLink url={item.link}>{item.text}</ExternalLink></span>}
      </div>
    ))}
  </div>
);

const TechnicalSkills = () => {
  const currentYear = new Date().getFullYear();
  const csharpYears = currentYear - 2014;
  const azureYears = currentYear - 2017;
  const noSqlYears = currentYear - 2018;
  const mlYears = currentYear - 2018;

  return (
    <Section id="skills" title="Technologies of choice">
      {[
        { name: "C#", level: Math.min((csharpYears * 10), 100), years: csharpYears },
        { name: "Azure", level:  Math.min((azureYears * 10), 100), years: azureYears },
        { name: "ASP.NET Web API", level: 60, years: 6 },
        { name: "SQL + EF", level: 50, years: 5 },
        { name: 'NoSQL (CosmosDB, Mongo)', years: noSqlYears, level: Math.min((noSqlYears * 10), 100) },
        { name: 'WPF in MVVM', years: 4, level: 40 },
        { name: 'ML (ML.NET, Accord.NET, Keras, GPT API)', years: mlYears, level: Math.min((mlYears * 10), 100)  }
      ].map((skill, index) => (
        <div className="skill" key={index}>
          <div>{skill.name}</div>
          <div className="bar"><div className="progress" style={{ width: `${skill.level}%` }}></div></div>
          <span>{skill.years} years</span>
        </div>
      ))}
    </Section>
  );
};

const useTranslation = (key) => {
  const { language } = useContext(LanguageContext);
  return translations[language][key];
};

const Section = ({ id, children }) => (
  <div className="section" id={id}>
    <h2>{useTranslation(id)}</h2>
    {children}
  </div>
);

const ExternalLink = ({ url, children, className }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
};

const SoftSkills = () => (
  <Section id="soft-skills" title="Soft Skills">
    <ul>
      {['Integrity', 'Persistence', 'Autonomy', 'Creativity', 'Deep Focus'].map((skill, index) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>
  </Section>
);

const Education = () => (
  <Section id="education" title="Formal Education">
    <p><strong>Polish/French Bilingual High School</strong> - 2004 to 2008</p>
    <p><strong>Jagiellonian University - Psychology - Master</strong> - 2009 to 2016</p>
  </Section>
);

const WorkExperience = () => (
  <Section id="work-experience" title="Work Experience">
    <p><strong>IGE+XAO - Intern</strong> - 2014</p>
    <p>I was tasked with database-wide undo feature implementation which I accomplished by developing a T-SQL generator based on table schema which allowed a generation of undo procedure for each of hundreds of tables. Other tasks were related to C++ codebase refactoring and bugfixing.</p>
    <p><strong>Transactor Poland - (Junior) Software Developer</strong> - 2014 to 2017</p>
    <p>I started as a Junior Developer and was promoted to Regular Developer after successfully delivering first project — a WPF business intelligence application that aggregated data from multiple APIs, providing significant value to the customer at a low cost.
    Following this, I worked in an Agile team on an end-to-end insurance lifetime management system, handling development, refactoring, bug fixing, and unit testing. A major part of my role involved working with T-SQL stored procedures, WCF services, ASP.NET APIs, WPF, Windows Forms, XSLT, XSD, VB.NET, and SQLite.
    I participated in multiple third-party integrations, including payment providers and data enrichment services, ensuring interoperability between systems. Throughout this role, I gained experience in wide range of technologies like performance and SQL profiling, WCF, WWF, XSLTs, SOAP and many more.</p>
    <p><strong>Open GI - Software Developer</strong> - 2017 to 2019</p>
    <p>Continuation of previous employment under different brand. More focus on newer technologies, we used ASP.NET Core over WCF, RabbitMQ instead of WWF, more Azure over on premise, 
    MongoDB over MS SQL. A significant challenge was modernizing an archaic VB6 application, which we successfully achieved by splitting and migrating logic into WPF-based microservices while heavilly unit - testing existing functionality.
    </p>
    <p><strong>Jagiellonian University - Researcher</strong> - 2019 to 2020</p>
    <p>I participated in a grant-funded research  where I developed a classifier for monkey EEG brain activity and an Arduino-based tactile stimulator. 
      The stimulator is programmable via COM and featured 2 gloves with 5 tactile stimulators, each controllable separately 
      [<a href="https://github.com/PFalkowski/HapticStimulatorPCA9685" target="_blank" rel="noopener noreferrer">source</a>].
       I classified the monkey awake states in Python's Keras with accuracy above 0.8 after applying FFT and other transformations to raw EEG time series [<a href="https://github.com/PFalkowski/KerasClassifierEeg" target="_blank" rel="noopener noreferrer">source</a>]. </p>
    <p><strong>Seville More Helory Polska - Senior Software Developer</strong> - since 2020</p>
    <p>In my current role, I have been responsible for planning and implementing the architecture of a bespoke process for a key client. As the lead developer, I had to make critical design choices early on without having the full scope of requirements. My approach ensured flexibility, allowing us to adapt seamlessly as the project evolved.
       Beyond development, I played a key role in preventing misguided technical decisions at the management level. When leadership pushed for excessive encoding layers to resolve data exchange issues between the front end and back end, I took a step back, investigated the root cause, and resolved the issue by removing just a few lines of code, avoiding unnecessary complexity.
      My tech stack includes C# with CosmosDB, along with Azure services such as Service Bus, Redis Cache, and AI Search. Over the years, I have designed and executed multiple database migrations, refining my expertise in agile NoSQL architecture—ensuring models remain adaptable to changing requirements while remaining efficient and easy to migrate.</p>
  </Section>
);

const Languages = () => (
  <Section id="languages" title="Languages">
    <ul>
      <li>Polish - Native</li>
      <li>English - C2</li>
      <li>French - B2</li>
    </ul>
  </Section>
);

const Conferences = () => (
  <Section id="conferences" title="Conferences">
    <ul>
      <li>.NET DeveloperDays 2018</li>
      <li>MEGA Sekurak Hacking Party 2019</li>
      <li>AzureDay 2020</li>
      <li>MEGA Sekurak Hacking Party 2020</li>
    </ul>
  </Section>
);

const AdditionalInfo = () => (
  <Section id="additional-info" title="Additional Information">
    <ul>
      <li>Category B driving license.</li>
      <li>Knowledge in psychology.</li>
      <li>Hobbies: economy (personal finance and quantitative analysis), board games, running, gym.</li>
    </ul>
  </Section>
);

const OtherProjects = () => (
  <Section id="github-activity" title="Other Projects">
    <p>
      I am actively developing a stock market analysis tool designed to provide daily updated insights for both speculative trading and long-term investing. 
      The backend, built in C#, is responsible for fetching market data, performing quantitative and fundamental analysis, generating report 
      and pushing the results to a GitHub repository. A GitHub Action then triggers the deployment of a static website to Azure, enabling 
      cost-effective hosting with full automation. The website with latest analysis results <a href="https://stockinsight.pl" target="_blank" rel="noopener noreferrer">StockInsight.pl</a>
    </p>
    <p>
      I serve as the CTO of <a href="https://squizzu.com" target="_blank" rel="noopener noreferrer">Squizzu.com</a>, 
      a tech quiz platform biult in React / C#. I architected most of the data model, implemented most of it, set the CosmosDB, KeyVault on Azure and integrated with them.
    </p>
    <p>
      Throughout my journey, I have also explored other startup ventures, including Drwal.it, an online course platform, 
      and a calendar tool built with PowerApps. While these projects didn’t achieve long-term success, they provided 
      valuable lessons and skills like proficiency in PowerPlatform.
    </p>
    <p>
      I actively develop and maintain several NuGet packages that enhance developer productivity.
      Here are a few notable ones:
    </p>
    <ul>
      <li>
        <strong>
          <a href="https://www.nuget.org/packages/LoggerLite" target="_blank" rel="noopener noreferrer">
            LoggerLite
          </a>
        </strong> - A lightweight logging framework supporting JSON, XML, YAML, and console output, with built-in passive debouncing.
      </li>
      <li>
        <strong>
          <a href="https://www.nuget.org/packages/OnTheFlyStats" target="_blank" rel="noopener noreferrer">
            OnTheFlyStats
          </a>
        </strong> - Allows on-the-fly computation of statistics such as means, variance allowing O(1) access.
      </li>
      <li>
        <strong>
          <a href="https://www.nuget.org/packages/Extensions.Standard" target="_blank" rel="noopener noreferrer">
            Extensions.Standard
          </a>
        </strong> - A collection of extension methods for common programming tasks such as interpolation, partitioning, and softmax calculations.
      </li>
      <li>
        <strong>
          <a href="https://www.nuget.org/packages/ProgressReporting" target="_blank" rel="noopener noreferrer">
            ProgressReporting
          </a>
        </strong> - A helper library for estimating remaining time and reporting progress in iterative or data-transfer scenarios.
      </li>
    </ul>
    <p>
      These and other packages are available on <a href="https://www.nuget.org/profiles/PFalkowski" target="_blank" rel="noopener noreferrer">NuGet.org</a>.
    </p>
    <p>My GitHub activity <span style={{ visibility: "hidden" }}>just because this CV needs a litle bit of green :)</span></p>
    <img src="http://ghchart.rshah.org/PFalkowski" alt="GitHub activity chart" />
  </Section>
);

const ConsentSection = () => (
  <div className="consent-section">
    <p><em>I hereby agree for processing the following personal information strictly for the purposes of recruitment processes under Art. 23ust 1 pkt 1 of the Personal Data Protection Act as of 29 August 1997, consolidated text: Journal of Laws 2016, item 922 as amended and under Art. 6 ust.1 lit. a of Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such GDPR (Dz. U. UE. L. z 2016 r. Nr 119.)</em></p>
  </div>
);

export default App;
