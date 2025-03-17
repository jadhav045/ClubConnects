import java.util.*;

public class LexicalAnalyzer {
    
    /* Step 1: Define sets for different parts of speech */
    private static final Set<String> verbs = new HashSet<>(Arrays.asList(
        "is", "am", "are", "were", "was", "be", "being", "been",
        "do", "does", "did", "will", "would", "should", "can", "could",
        "has", "have", "had", "go"
    ));
    
    private static final Set<String> adverbs = new HashSet<>(Arrays.asList(
        "very", "simply", "gently", "quietly", "calmly", "angrily"
    ));
    
    private static final Set<String> prepositions = new HashSet<>(Arrays.asList(
        "to", "from", "behind", "above", "below", "between"
    ));
    
    private static final Set<String> conjunctions = new HashSet<>(Arrays.asList(
        "if", "then", "and", "but", "or"
    ));
    
    private static final Set<String> adjectives = new HashSet<>(Arrays.asList(
        "alive", "better", "clever", "careful", "dead", "easy", "good", "gifted",
        "hallowed", "helpful", "important", "inexpensive", "mealy", "famous"
    ));
    
    private static final Set<String> pronouns = new HashSet<>(Arrays.asList(
        "I", "you", "he", "their", "my", "your", "his", "her", "she", "we", "they"
    ));
    
    /* Step 2: Tokenize input and classify words */
    public static void analyze(String input) {
        String[] words = input.split("\\s+"); // Tokenize input using spaces
        
        for (String word : words) {
            if (verbs.contains(word)) {
                System.out.println(word + ": is a verb");
            } else if (adverbs.contains(word)) {
                System.out.println(word + ": is an adverb");
            } else if (prepositions.contains(word)) {
                System.out.println(word + ": is a preposition");
            } else if (conjunctions.contains(word)) {
                System.out.println(word + ": is a conjunction");
            } else if (adjectives.contains(word)) {
                System.out.println(word + ": is an adjective");
            } else if (pronouns.contains(word)) {
                System.out.println(word + ": is a pronoun");
            } else {
                System.out.println(word + ": don’t recognize, might be a noun");
            }
        }
    }
    
    /* Step 3: Read input from user and analyze */
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter a sentence:");
        String input = scanner.nextLine();
        analyze(input);
        scanner.close();
    }
}
