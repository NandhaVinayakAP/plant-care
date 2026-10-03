package com.plantcare.config;

import com.plantcare.entity.Species;
import com.plantcare.entity.User;
import com.plantcare.enums.*;
import com.plantcare.repository.SpeciesRepository;
import com.plantcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SpeciesRepository speciesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        loadUsers();
        loadSpecies();
    }

    private void loadUsers() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@plantcare.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setRole(UserRole.ADMIN);
            admin.setIsActive(true);
            admin.setEmailVerified(true);
            userRepository.save(admin);

            User specialist = new User();
            specialist.setUsername("specialist");
            specialist.setEmail("specialist@plantcare.com");
            specialist.setPassword(passwordEncoder.encode("specialist123"));
            specialist.setFullName("Dr. Green Thumb");
            specialist.setRole(UserRole.PLANT_CARE_SPECIALIST);
            specialist.setIsActive(true);
            specialist.setEmailVerified(true);
            specialist.setExpertise("Tropical plants, succulents, and indoor gardens");
            specialist.setBio("Certified horticulturist with 15 years of experience");
            userRepository.save(specialist);

            User premium = new User();
            premium.setUsername("premium");
            premium.setEmail("premium@plantcare.com");
            premium.setPassword(passwordEncoder.encode("premium123"));
            premium.setFullName("Premium User");
            premium.setRole(UserRole.PREMIUM_PLANT_OWNER);
            premium.setIsActive(true);
            premium.setEmailVerified(true);
            premium.setGardeningExperience(GardeningExperience.ADVANCED);
            userRepository.save(premium);

            User standard = new User();
            standard.setUsername("user");
            standard.setEmail("user@plantcare.com");
            standard.setPassword(passwordEncoder.encode("user123"));
            standard.setFullName("Standard User");
            standard.setRole(UserRole.STANDARD_PLANT_OWNER);
            standard.setIsActive(true);
            standard.setEmailVerified(true);
            standard.setGardeningExperience(GardeningExperience.BEGINNER);
            userRepository.save(standard);

            System.out.println("=== Default users created ===");
            System.out.println("Admin:      admin / admin123");
            System.out.println("Specialist: specialist / specialist123");
            System.out.println("Premium:    premium / premium123");
            System.out.println("Standard:   user / user123");
        }
    }

    private void loadSpecies() {
        if (speciesRepository.count() == 0) {
            Species fiddleLeafFig = new Species();
            fiddleLeafFig.setCommonName("Fiddle Leaf Fig");
            fiddleLeafFig.setScientificName("Ficus lyrata");
            fiddleLeafFig.setFamilyName("Moraceae");
            fiddleLeafFig.setCareDifficulty(CareDifficulty.MODERATE);
            fiddleLeafFig.setLightRequirements(LightRequirement.HIGH);
            fiddleLeafFig.setWaterFrequencyDays(7);
            fiddleLeafFig.setHumidityMin(40);
            fiddleLeafFig.setHumidityMax(60);
            fiddleLeafFig.setTemperatureMinCelsius(new BigDecimal("18.0"));
            fiddleLeafFig.setTemperatureMaxCelsius(new BigDecimal("24.0"));
            fiddleLeafFig.setSoilPhMin(new BigDecimal("6.0"));
            fiddleLeafFig.setSoilPhMax(new BigDecimal("7.0"));
            fiddleLeafFig.setGrowthRate(GrowthRate.MODERATE);
            fiddleLeafFig.setMaxHeightCm(300);
            fiddleLeafFig.setFertilizerFrequencyDays(30);
            fiddleLeafFig.setPruningFrequencyDays(90);
            fiddleLeafFig.setRepottingFrequencyMonths(24);
            fiddleLeafFig.setCommonIssues("Leaf drop, brown spots, root rot");
            fiddleLeafFig.setCareTips("Keep in bright indirect light, water when top inch of soil is dry");
            speciesRepository.save(fiddleLeafFig);

            Species snakePlant = new Species();
            snakePlant.setCommonName("Snake Plant");
            snakePlant.setScientificName("Dracaena trifasciata");
            snakePlant.setFamilyName("Asparagaceae");
            snakePlant.setCareDifficulty(CareDifficulty.EASY);
            snakePlant.setLightRequirements(LightRequirement.LOW);
            snakePlant.setWaterFrequencyDays(14);
            snakePlant.setHumidityMin(30);
            snakePlant.setHumidityMax(50);
            snakePlant.setTemperatureMinCelsius(new BigDecimal("15.0"));
            snakePlant.setTemperatureMaxCelsius(new BigDecimal("27.0"));
            snakePlant.setSoilPhMin(new BigDecimal("5.5"));
            snakePlant.setSoilPhMax(new BigDecimal("7.5"));
            snakePlant.setGrowthRate(GrowthRate.SLOW);
            snakePlant.setMaxHeightCm(120);
            snakePlant.setFertilizerFrequencyDays(60);
            snakePlant.setPruningFrequencyDays(180);
            snakePlant.setRepottingFrequencyMonths(36);
            snakePlant.setCommonIssues("Overwatering, yellowing leaves");
            snakePlant.setCareTips("Very drought tolerant, water sparingly, tolerates low light");
            speciesRepository.save(snakePlant);

            Species monstera = new Species();
            monstera.setCommonName("Monstera Deliciosa");
            monstera.setScientificName("Monstera deliciosa");
            monstera.setFamilyName("Araceae");
            monstera.setCareDifficulty(CareDifficulty.EASY);
            monstera.setLightRequirements(LightRequirement.MEDIUM);
            monstera.setWaterFrequencyDays(7);
            monstera.setHumidityMin(50);
            monstera.setHumidityMax(70);
            monstera.setTemperatureMinCelsius(new BigDecimal("18.0"));
            monstera.setTemperatureMaxCelsius(new BigDecimal("27.0"));
            monstera.setSoilPhMin(new BigDecimal("5.5"));
            monstera.setSoilPhMax(new BigDecimal("7.0"));
            monstera.setGrowthRate(GrowthRate.FAST);
            monstera.setMaxHeightCm(300);
            monstera.setFertilizerFrequencyDays(30);
            monstera.setPruningFrequencyDays(90);
            monstera.setRepottingFrequencyMonths(24);
            monstera.setCommonIssues("Yellow leaves, no fenestrations, root rot");
            monstera.setCareTips("Provide bright indirect light, use well-draining soil");
            speciesRepository.save(monstera);

            Species pothos = new Species();
            pothos.setCommonName("Golden Pothos");
            pothos.setScientificName("Epipremnum aureum");
            pothos.setFamilyName("Araceae");
            pothos.setCareDifficulty(CareDifficulty.EASY);
            pothos.setLightRequirements(LightRequirement.LOW);
            pothos.setWaterFrequencyDays(10);
            pothos.setHumidityMin(40);
            pothos.setHumidityMax(60);
            pothos.setTemperatureMinCelsius(new BigDecimal("17.0"));
            pothos.setTemperatureMaxCelsius(new BigDecimal("30.0"));
            pothos.setGrowthRate(GrowthRate.FAST);
            pothos.setMaxHeightCm(200);
            pothos.setFertilizerFrequencyDays(60);
            pothos.setRepottingFrequencyMonths(24);
            pothos.setCommonIssues("Yellow leaves, brown tips");
            pothos.setCareTips("Very forgiving, tolerates neglect, great for beginners");
            speciesRepository.save(pothos);

            Species jade = new Species();
            jade.setCommonName("Jade Plant");
            jade.setScientificName("Crassula ovata");
            jade.setFamilyName("Crassulaceae");
            jade.setCareDifficulty(CareDifficulty.EASY);
            jade.setLightRequirements(LightRequirement.HIGH);
            jade.setWaterFrequencyDays(14);
            jade.setHumidityMin(30);
            jade.setHumidityMax(40);
            jade.setTemperatureMinCelsius(new BigDecimal("18.0"));
            jade.setTemperatureMaxCelsius(new BigDecimal("24.0"));
            jade.setGrowthRate(GrowthRate.SLOW);
            jade.setMaxHeightCm(120);
            jade.setFertilizerFrequencyDays(90);
            jade.setRepottingFrequencyMonths(24);
            jade.setCommonIssues("Overwatering, leaf drop");
            jade.setCareTips("Use cactus soil, water deeply but infrequently");
            speciesRepository.save(jade);

            System.out.println("=== Default species created ===");
        }
    }
}
