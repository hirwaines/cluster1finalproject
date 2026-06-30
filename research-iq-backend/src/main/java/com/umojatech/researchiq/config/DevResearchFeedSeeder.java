package com.umojatech.researchiq.config;

import com.umojatech.researchiq.entity.Research;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.FundingStatus;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import com.umojatech.researchiq.repository.ResearchRepository;
import com.umojatech.researchiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@Profile("dev")
@Order(5)
@RequiredArgsConstructor
public class DevResearchFeedSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevResearchFeedSeeder.class);

    private final UserRepository userRepository;
    private final ResearchRepository researchRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // Only skip if the sample researchers are already in DB (prevents re-seeding on restart)
        if (userRepository.findByEmail("alice.mwangi@researchiq.local").isPresent()) {
            log.info("DevResearchFeedSeeder: sample researchers already seeded, skipping");
            return;
        }

        String pwd = passwordEncoder.encode("12345678");

        User alice = ensureResearcher("alice.mwangi@researchiq.local", "Dr. Alice Mwangi",
                "Department of Medicine", "University of Nairobi",
                "medicine,epidemiology,public health", pwd);
        User carlos = ensureResearcher("carlos.teixeira@researchiq.local", "Prof. Carlos Teixeira",
                "Department of Computer Science", "University of São Paulo",
                "machine learning,natural language processing,AI ethics", pwd);
        User fatima = ensureResearcher("fatima.hassan@researchiq.local", "Dr. Fatima Hassan",
                "Department of Economics", "Cairo University",
                "development economics,microfinance,gender equality", pwd);
        User jean = ensureResearcher("jean.baptiste@researchiq.local", "Dr. Jean-Baptiste Nkurunziza",
                "Department of Environmental Science", "University of Rwanda",
                "climate change,agriculture,food security", pwd);
        User priya = ensureResearcher("priya.sharma@researchiq.local", "Dr. Priya Sharma",
                "Department of Biomedical Engineering", "IIT Delhi",
                "biosensors,drug delivery,nanotechnology", pwd);

        seedPub(alice, "Epidemiological Patterns of Malaria in Sub-Saharan Africa: A 10-Year Longitudinal Study",
                "medicine", "medicine,epidemiology,malaria,sub-saharan africa",
                "This study examines malaria incidence across 12 countries over a decade, identifying seasonal drivers and the impact of bed-net distribution programmes on under-5 mortality.",
                "10.1016/j.ijid.2024.01.001", 2024, 143, FundingStatus.FUNDED);

        seedPub(alice, "COVID-19 Vaccine Hesitancy Among Rural Communities in East Africa",
                "medicine", "medicine,vaccine hesitancy,covid-19,east africa",
                "A mixed-methods study of 4,200 participants in Kenya, Tanzania, and Uganda exploring socio-cultural barriers to COVID-19 vaccination uptake in rural settings.",
                "10.1093/inthealth/ihad055", 2023, 87, FundingStatus.SEEKING);

        seedPub(carlos, "Multilingual Sentiment Analysis for Low-Resource African Languages Using Transfer Learning",
                "computer science", "NLP,transfer learning,low-resource languages,sentiment analysis",
                "We present a cross-lingual sentiment model fine-tuned on Swahili, Amharic, and Hausa corpora achieving 83% F1, outperforming prior baselines by 11 percentage points.",
                "10.18653/v1/2024.acl-long.312", 2024, 210, FundingStatus.FUNDED);

        seedPub(carlos, "Federated Learning for Privacy-Preserving Health Data Analysis in Resource-Constrained Environments",
                "computer science", "federated learning,privacy,health AI,edge computing",
                "A novel federated framework allowing hospitals with limited connectivity to collaboratively train diagnostic models without sharing raw patient data, demonstrated on chest X-ray classification.",
                "10.1145/3589334.3645491", 2024, 56, null);

        seedPub(fatima, "Impact of Mobile Money on Women's Financial Inclusion in Rwanda",
                "economics", "economics,mobile money,financial inclusion,gender,Rwanda",
                "Using panel data from 6,500 Rwandan households between 2018 and 2023, this paper shows mobile money adoption increases women's savings rates by 23% and reduces vulnerability to income shocks.",
                "10.1016/j.jdeveco.2024.103145", 2024, 38, FundingStatus.FUNDED);

        seedPub(fatima, "Microfinance, Social Capital and Entrepreneurship: Evidence from East African Women",
                "economics", "economics,microfinance,entrepreneurship,social capital",
                "A randomised evaluation of group-lending microfinance programmes across Kenya and Uganda finds that social cohesion within lending groups mediates loan repayment and business performance.",
                "10.1093/wbro/lkad009", 2023, 61, null);

        seedPub(jean, "Agroforestry Adoption and Food Security Outcomes in the Rwandan Highlands",
                "environmental science", "climate change,agroforestry,food security,Rwanda,highlands",
                "Satellite and household survey data from 2,300 farms show that agroforestry integration increases crop yields by 18% during drought years and improves dietary diversity scores for smallholder families.",
                "10.1007/s10457-023-00945-w", 2023, 44, FundingStatus.SEEKING);

        seedPub(jean, "Carbon Sequestration Potential of Restored Wetlands in the Congo Basin",
                "environmental science", "carbon sequestration,wetlands,Congo Basin,climate mitigation",
                "LiDAR and soil core analysis across 14 restored wetland sites estimates sequestration rates of 4.2 tC/ha/yr, representing a cost-effective nature-based solution for national NDC targets.",
                "10.1038/s41558-024-01983-3", 2024, 29, FundingStatus.FUNDED);

        seedPub(priya, "Gold Nanoparticle-Functionalized Electrochemical Biosensor for Rapid Point-of-Care Tuberculosis Detection",
                "biomedical engineering", "biosensors,tuberculosis,nanotechnology,point-of-care diagnostics",
                "A low-cost electrochemical sensor using AuNP-antibody conjugates detects Mycobacterium tuberculosis antigens in sputum within 15 minutes with 97.3% sensitivity, suitable for low-resource clinic settings.",
                "10.1021/acsnano.4c02187", 2024, 95, FundingStatus.FUNDED);

        seedPub(priya, "pH-Responsive Chitosan Nanoparticles for Targeted Oral Delivery of Metformin in Type 2 Diabetes",
                "biomedical engineering", "drug delivery,nanoparticles,diabetes,oral bioavailability",
                "Chitosan-based nanocarriers with pH-triggered release achieve 3.4-fold improvement in metformin oral bioavailability in diabetic rat models, reducing required dosage and GI side effects.",
                "10.1016/j.jconrel.2024.03.041", 2024, 72, null);

        log.info("DevResearchFeedSeeder: seeded sample research publications into the feed");
    }

    private User ensureResearcher(String email, String name, String department, String institution, String keywords, String pwd) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setName(name);
            u.setEmail(email);
            u.setPassword(pwd);
            u.setRole(UserRole.RESEARCHER);
            u.setStatus(UserStatus.ACTIVE);
            u.setDepartment(department);
            u.setInstitution(institution);
            u.setExpertiseKeywords(keywords);
            return userRepository.save(u);
        });
    }

    private void seedPub(User researcher, String title, String field, String keywords,
                         String abstractText, String doi, int year, int citations, FundingStatus fundingStatus) {
        if (researchRepository.existsByResearcher_IdAndDoi(researcher.getId(), doi)) return;
        Research r = new Research();
        r.setTitle(title);
        r.setField(field);
        r.setKeywords(keywords);
        r.setAbstractText(abstractText);
        r.setAuthors(researcher.getName());
        r.setDoi(doi);
        r.setPublicationDate(LocalDate.of(year, 6, 1));
        r.setCitationCount(citations);
        r.setFundingStatus(fundingStatus);
        r.setResearcher(researcher);
        researchRepository.save(r);
    }
}
