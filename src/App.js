import phoneIcon from "./assets/images/phone.png";
import emailIcon from "./assets/images/email.png";

import './App.css';
import React, { useState, useEffect, useContext, createContext } from "react";

import en from "./locales/en.json";
import pl from "./locales/pl.json";

// Create Language Context
const LanguageContext = createContext({
  language: 'en',
  toggleLanguage: () => {},
});

const translations = { en, pl };

// Hook to get translation for a given key
const useTranslation = (id) => {
  const { language } = useContext(LanguageContext);
  return id.split('.').reduce((obj, key) => obj?.[key], translations[language]) || id;
};

// Language Switcher Component
const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);

  return (
    <div className="language-switcher">
      <div
        className={`item ${language === "en" ? "active" : ""}`}
        onClick={() => toggleLanguage("en")}
      >
        <span className="flag-icon flag-icon-us"></span>
      </div>
      <div
        className={`item ${language === "pl" ? "active" : ""}`}
        onClick={() => toggleLanguage("pl")}
      >
        <span className="flag-icon flag-icon-pl"></span>
      </div>
    </div>
  );
};


const App = () => {
  const [language, setLanguage] = useState("en");
  

  // Define Section component inside App to ensure it has access to context
  const Section = ({ id, children }) => (
    <div className="section" id={id}>
      <h2>{useTranslation(`sections.${id}`)}</h2>
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

  const WorkExperience = () => (
    <Section id="workExperience">
      <p><strong>{useTranslation("workExperience.igexao.title")}</strong> - {useTranslation("workExperience.igexao.year")}</p>
      <p>{useTranslation("workExperience.igexao.description")}</p>
      
      <p><strong>{useTranslation("workExperience.transactor.title")}</strong> - {useTranslation("workExperience.transactor.period")}</p>
      <p>{useTranslation("workExperience.transactor.description")}</p>
      
      <p><strong>{useTranslation("workExperience.opengi.title")}</strong> - {useTranslation("workExperience.opengi.period")}</p>
      <p>{useTranslation("workExperience.opengi.description")}</p>
      
      <p><strong>{useTranslation("workExperience.ju.title")}</strong> - {useTranslation("workExperience.ju.period")}</p>
      <p>{useTranslation("workExperience.ju.description")
        .replace("{sourceLink1}", 
          <ExternalLink url="https://github.com/PFalkowski/HapticStimulatorPCA9685">[source]</ExternalLink>)
        .replace("{sourceLink2}", 
          <ExternalLink url="https://github.com/PFalkowski/KerasClassifierEeg">[source]</ExternalLink>)
      }</p>
      
      <p><strong>{useTranslation("workExperience.smh.title")}</strong> - {useTranslation("workExperience.smh.period")}</p>
      <p>{useTranslation("workExperience.smh.description")}</p>
    </Section>
  );
  
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
            <img src={`${item.img}`} alt=""/>
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
      <Section id="technicalSkills">
        {[
          { name: "C#", level: Math.min((csharpYears * 10), 100), years: csharpYears },
          { name: "Azure Cloud", level:  Math.min((azureYears * 10), 100), years: azureYears },
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
  
  const SoftSkills = () => {
    const skills = useTranslation("softSkills.list");
    return (
      <Section id="softSkills">
        <ul>
          {Array.isArray(skills) ? skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          )) : null}
        </ul>
      </Section>
    );
  };
  
  const Education = () => (
    <Section id="educationSection">
      <p><strong>{useTranslation("education.highSchool.name")}</strong> - {useTranslation("education.highSchool.period")}</p>
      <p><strong>{useTranslation("education.university.name")}</strong> - {useTranslation("education.university.period")}</p>
    </Section>
  );
  
  const Languages = () => (
    <Section id="languageSection">
      <ul>
        <li>{useTranslation("languages.polish")}</li>
        <li>{useTranslation("languages.english")}</li>
        <li>{useTranslation("languages.french")}</li>
      </ul>
    </Section>
  );
  
  const Conferences = () => {
    const conferences = useTranslation("conferences.list");
    return (
      <Section id="conferencesSection">
      <ul>        
        {Array.isArray(conferences) ? conferences.map((conference, index) => (
            <li key={index}>{conference}</li>
          )) : null}
      </ul>
    </Section>
    );
  };
  
  const AdditionalInfo = () => (
    <Section id="additionalInfo">
      <ul>
        <li>{useTranslation("additionalInfo.drivingLicense")}</li>
        <li>{useTranslation("additionalInfo.psychology")}</li>
        <li>{useTranslation("additionalInfo.hobbies")}</li>
      </ul>
    </Section>
  );
  
  const OtherProjects = () => (
    <Section id="otherProjects">
      <p>
        {useTranslation("otherProjects.stockinsight").replace(
          "{stockinsightLink}",
          <ExternalLink url="https://stockinsight.pl">StockInsight.pl</ExternalLink>
        )}
      </p>
      <p>
        {useTranslation("otherProjects.squizzu").replace(
          "{squizzuLink}",
          <ExternalLink url="https://squizzu.com">Squizzu.com</ExternalLink>
        )}
      </p>
      <p>{useTranslation("otherProjects.otherVentures")}</p>
      <p>{useTranslation("otherProjects.nugetIntro")}</p>
      <ul>
        <li>
          <strong>
            <ExternalLink url="https://www.nuget.org/packages/LoggerLite">LoggerLite</ExternalLink>
          </strong> - {useTranslation("otherProjects.nugetPackages.loggerLite")}
        </li>
        <li>
          <strong>
            <ExternalLink url="https://www.nuget.org/packages/OnTheFlyStats">OnTheFlyStats</ExternalLink>
          </strong> - {useTranslation("otherProjects.nugetPackages.onTheFlyStats")}
        </li>
        <li>
          <strong>
            <ExternalLink url="https://www.nuget.org/packages/Extensions.Standard">Extensions.Standard</ExternalLink>
          </strong> - {useTranslation("otherProjects.nugetPackages.extensionsStandard")}
        </li>
        <li>
          <strong>
            <ExternalLink url="https://www.nuget.org/packages/ProgressReporting">ProgressReporting</ExternalLink>
          </strong> - {useTranslation("otherProjects.nugetPackages.progressReporting")}
        </li>
      </ul>
      <p>
        {useTranslation("otherProjects.nugetFooter").replace(
          "{nugetLink}",
          <ExternalLink url="https://www.nuget.org/profiles/PFalkowski">NuGet.org</ExternalLink>
        )}
      </p>
      <p>{useTranslation("otherProjects.githubActivity")}</p>
      <img src="http://ghchart.rshah.org/PFalkowski" alt="GitHub activity chart" />
    </Section>
  );
  
  const ConsentSection = () => (
    <div id="consent">
      <p><em>{useTranslation("consent")}</em></p>
    </div>
  );

  const SidebarSection = () => (
    <aside className="sidebar">
    <h1>{useTranslation("header.name")}</h1>
    <p>{useTranslation("header.title")}</p>
    <ContactInfo />
  </aside>
  );

  const AboutMeSection = () => (
    <Section id="aboutMe">
    <p>{useTranslation("about.firstParagraph")}</p>    <p>
      {useTranslation("about.secondParagraph")
        .split(/({stockinsight}|{squizzu})/)
        .map((part, index) => {
          if (part === "{stockinsight}") {
            return <ExternalLink key={index} url={'https://stockinsight.pl'}>Stockinsight.pl</ExternalLink>;
          }
          if (part === "{squizzu}") {
            return <ExternalLink key={index} url='https://squizzu.com'>Squizzu.com</ExternalLink>;
          }
          return part;
        })}
  </p>
    </Section>
  )

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage: setLanguage }}>
      <div className="container">
        <LanguageSwitcher />
        <SidebarSection/>
        <main className="content">          
          <AboutMeSection/>
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


export default App;
